import crypto from 'crypto';

// Generate server-held ES256 keypair on startup
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'prime256v1',
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

export interface JourneyPassPayload {
  sub: string; // Passenger user ID
  pid: string; // Journey Pass ID
  legs: {
    legNumber: number;
    mode: string;
    startPointId: string;
    endPointId: string;
    plannedTime: string;
    assignedRideId?: string;
  }[];
  cur: number; // Current leg index
  nonce: string; // Random single-use nonce
  iat: number; // Issued at (seconds)
  exp: number; // Expiry at (seconds, iat + 60s)
  sc: string; // 6-character short code fallback
}

// Track burned nonces (in-memory nonce store)
const burnedNonces = new Set<string>();

/**
 * Sign a Journey Pass payload using server's ES256 private key
 */
export function signJourneyPass(payload: JourneyPassPayload): string {
  const header = { alg: 'ES256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const data = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('SHA256');
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey).toString('base64url');

  return `${data}.${signature}`;
}

export type ScanVerificationResult =
  | { success: true; state: 'VALID'; payload: JourneyPassPayload; message: 'Passenger verified. Accept to start the leg.' }
  | { success: false; state: 'EXPIRED'; message: 'Code expired. Ask passenger to refresh the QR.' }
  | { success: false; state: 'ALREADY_USED'; message: 'This code was already scanned. Replay rejected.' }
  | { success: false; state: 'WRONG_RIDER'; message: 'You are not assigned to this ride leg.' }
  | { success: false; state: 'TOO_FAR'; message: 'Passenger is not at the designated pickup point.' }
  | { success: false; state: 'INACTIVE'; message: 'This pass is no longer active or has been cancelled.' }
  | { success: false; state: 'INVALID'; message: 'Not a valid CommuteCircle pass.' };

/**
 * Verify scanned Journey Pass string on server side
 */
export function verifyJourneyPass(
  tokenString: string,
  riderId: string,
  assignedRideId?: string,
  coPresenceCheckPassed: boolean = true
): ScanVerificationResult {
  try {
    const parts = tokenString.trim().split('.');
    if (parts.length !== 3) {
      return { success: false, state: 'INVALID', message: 'Not a valid CommuteCircle pass.' };
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const data = `${headerB64}.${payloadB64}`;

    const verifier = crypto.createVerify('SHA256');
    verifier.update(data);
    verifier.end();

    const signatureBuffer = Buffer.from(signatureB64, 'base64url');
    const isValidSignature = verifier.verify(publicKey, signatureBuffer);

    if (!isValidSignature) {
      return { success: false, state: 'INVALID', message: 'Not a valid CommuteCircle pass.' };
    }

    const payload: JourneyPassPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf-8')
    );

    // 1. Check Nonce (already used check)
    if (burnedNonces.has(payload.nonce)) {
      return {
        success: false,
        state: 'ALREADY_USED',
        message: 'This code was already scanned. Replay rejected.',
      };
    }

    // 2. Check Expiry (older than 60s)
    const nowSec = Math.floor(Date.now() / 1000);
    if (nowSec > payload.exp) {
      return {
        success: false,
        state: 'EXPIRED',
        message: 'Code expired. Ask passenger to refresh the QR.',
      };
    }

    // 3. Check Rider Assignment for the current leg
    const currentLeg = payload.legs[payload.cur];
    if (assignedRideId && currentLeg?.assignedRideId && currentLeg.assignedRideId !== assignedRideId) {
      return {
        success: false,
        state: 'WRONG_RIDER',
        message: 'You are not assigned to this ride leg.',
      };
    }

    // 4. Co-presence check
    if (!coPresenceCheckPassed) {
      return {
        success: false,
        state: 'TOO_FAR',
        message: 'Passenger is not at the designated pickup point.',
      };
    }

    // Nonce will be burned upon rider confirmation (Accept)
    return {
      success: true,
      state: 'VALID',
      payload,
      message: 'Passenger verified. Accept to start the leg.',
    };
  } catch (err) {
    return { success: false, state: 'INVALID', message: 'Not a valid CommuteCircle pass.' };
  }
}

/**
 * Permanently burn nonce upon confirmed boarding
 */
export function burnNonce(nonce: string) {
  burnedNonces.add(nonce);
}

/**
 * Helper to generate random 6-character short code
 */
export function generateShortCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
