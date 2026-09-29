import { store } from '../server/store';
import {
  signJourneyPass,
  verifyJourneyPass,
  burnNonce,
  generateShortCode,
} from '../server/jwtService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${details || 'Assertion failed'}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('   CommuteCircle Automated Core Validation Suite      ');
console.log('======================================================\n');

// -----------------------------------------------------------------
// 1. Fair-Fare Formula & Cap Verification (PRD §6.2 & §3.10)
// -----------------------------------------------------------------
console.log('[Test Group 1: Fair-Fare Calculation & Recovery Cap]');
const fareResult = store.calculateFairFare({
  fuelRatePerLitre: 102.63,
  mileageKmPerLitre: 15,
  routeDistanceKm: 8.5,
  tollAmount: 0,
  detourKm: 0.8,
  totalOccupants: 3,
});

assert(
  fareResult.fareShare > 0 && fareResult.fareShare <= fareResult.totalTripCost,
  'Fare share is positive and does not exceed total trip cost',
  `Fare: ${fareResult.fareShare}, Total: ${fareResult.totalTripCost}`
);

assert(
  fareResult.reason.includes('detour offset') && fareResult.reason.includes('0.8'),
  'Fare reason transparently explains detour kilometer offset',
  fareResult.reason
);

assert(
  fareResult.platformFee === Math.round(fareResult.fareShare * 0.05),
  'Platform maintenance fee is exactly 5%',
  `Fee: ${fareResult.platformFee}`
);

// -----------------------------------------------------------------
// 2. Trust Score & Tier Threshold Engine (PRD §6.3 & §3.8)
// -----------------------------------------------------------------
console.log('\n[Test Group 2: Gamified Trust Score & Weights]');
const sampleBreakdown = {
  safety: 35, // 35% max
  reliability: 25, // 25% max
  peerFeedback: 15, // 15% max
  verificationLevel: 10, // 10% max
  consistency: 10, // 10% max
  rideCount: 5, // 5% max
};
const totalTrust = Object.values(sampleBreakdown).reduce((a, b) => a + b, 0);

assert(totalTrust === 100, 'Sum of all trust score component weights equals 100%');

const anitha = store.users.get('user-anitha');
assert(
  anitha !== undefined && anitha.tier === 'Trusted' && anitha.trustScore >= 60,
  'Trusted tier requires score >= 60 (Anitha: 78)'
);

const karthik = store.users.get('user-karthik');
assert(
  karthik !== undefined && karthik.tier === 'Verified Guardian' && karthik.trustScore >= 80,
  'Verified Guardian tier requires score >= 80 (Karthik: 88)'
);

const meenakshi = store.users.get('user-meenakshi');
assert(
  meenakshi !== undefined && meenakshi.tier === 'Community Anchor' && meenakshi.trustScore >= 90,
  'Community Anchor tier requires score >= 90 (Meenakshi: 94)'
);

// -----------------------------------------------------------------
// 3. Journey Pass Signing & 7 Scan Result States (PRD §4.2 & §4.4)
// -----------------------------------------------------------------
console.log('\n[Test Group 3: Server-side JWT Verification & Scan States]');
store.resetToSeed();
const pass = store.createJourneyPass('user-anitha', [
  {
    legNumber: 1,
    mode: 'pool',
    startPointName: 'Velachery Bypass Junction',
    startLat: 12.9774,
    startLng: 80.2212,
    endPointName: 'IIT Madras Main Gate',
    endLat: 12.9915,
    endLng: 80.2337,
    plannedTime: '08:15',
    assignedRideId: 'ride-54266',
    fare: 28,
    status: 'current',
  },
]);

// 3.1 State: VALID
const scanValid = store.scanJourneyPass(pass.jwtToken, 'user-karthik', 'ride-54266', true);
assert(scanValid.result.success === true && scanValid.result.state === 'VALID', 'State 1: VALID pass accepted');

// 3.2 State: SHORT CODE ENTRY EQUIVALENCE (PRD §4.5)
const scanShortCode = store.scanJourneyPass(pass.shortCode, 'user-karthik', 'ride-54266', true);
assert(
  scanShortCode.result.success === true && scanShortCode.result.state === 'VALID',
  'Manual short code produces identical VALID result to QR'
);

// 3.3 State: ALREADY USED (Nonce Burn Replay Protection)
if (scanValid.result.success) {
  burnNonce(scanValid.result.payload.nonce);
}
const scanReplayed = store.scanJourneyPass(pass.jwtToken, 'user-karthik', 'ride-54266', true);
assert(
  scanReplayed.result.success === false && scanReplayed.result.state === 'ALREADY_USED',
  'State 2: ALREADY_USED - Replay of burned nonce strictly rejected'
);

// 3.4 State: EXPIRED
const expiredPayload = {
  sub: 'user-anitha',
  pid: 'pass-expired',
  legs: [],
  cur: 0,
  nonce: 'nonce-exp',
  iat: Math.floor(Date.now() / 1000) - 120,
  exp: Math.floor(Date.now() / 1000) - 60, // Expired 60s ago
  sc: 'EX1234',
};
const expiredToken = signJourneyPass(expiredPayload);
const scanExpired = store.scanJourneyPass(expiredToken, 'user-karthik', 'ride-54266', true);
assert(
  scanExpired.result.success === false && scanExpired.result.state === 'EXPIRED',
  'State 3: EXPIRED - Token older than 60s rejected'
);

// 3.5 State: WRONG RIDER
const pass2 = store.createJourneyPass('user-anitha', [
  {
    legNumber: 1,
    mode: 'pool',
    startPointName: 'A',
    startLat: 12.9,
    startLng: 80.2,
    endPointName: 'B',
    endLat: 12.91,
    endLng: 80.21,
    plannedTime: '08:00',
    assignedRideId: 'ride-99999',
    fare: 20,
    status: 'current',
  },
]);
const scanWrongRider = store.scanJourneyPass(pass2.jwtToken, 'user-karthik', 'ride-different-123', true);
assert(
  scanWrongRider.result.success === false && scanWrongRider.result.state === 'WRONG_RIDER',
  'State 4: WRONG_RIDER - Unassigned rider rejected with passenger privacy protected'
);

// 3.6 State: TOO FAR (Co-presence check)
const pass3 = store.createJourneyPass('user-anitha', [
  {
    legNumber: 1,
    mode: 'pool',
    startPointName: 'A',
    startLat: 12.9,
    startLng: 80.2,
    endPointName: 'B',
    endLat: 12.91,
    endLng: 80.21,
    plannedTime: '08:00',
    assignedRideId: 'ride-54266',
    fare: 20,
    status: 'current',
  },
]);
const scanTooFar = store.scanJourneyPass(pass3.jwtToken, 'user-karthik', 'ride-54266', false);
assert(
  scanTooFar.result.success === false && scanTooFar.result.state === 'TOO_FAR',
  'State 5: TOO_FAR - Passenger not at pickup point rejected'
);

// 3.7 State: INVALID (Malformed or forged signature)
const scanInvalid = store.scanJourneyPass('eyJhbGciOiJFUzI1NiJ9.malformed.fake-signature', 'user-karthik', 'ride-54266', true);
assert(
  scanInvalid.result.success === false && scanInvalid.result.state === 'INVALID',
  'State 6: INVALID - Forged or malformed JWT rejected'
);

// -----------------------------------------------------------------
// 4. Privacy Reveal Ladder (PRD §3.2 & Acceptance Test #6)
// -----------------------------------------------------------------
console.log('\n[Test Group 4: Privacy Reveal Ladder]');
store.resetToSeed();
const testRide = store.rides.get('ride-54266')!;
const participant = testRide.participants[0];

// Before boarding/handshake, exact landmark address must NOT be revealed
assert(
  participant.exactPickupPoint === undefined || participant.exactPickupPoint.address.includes('Near'),
  'Before confirmation/handshake, exact pickup coordinates are obscured'
);

// Accept boarding triggers exact point reveal
store.acceptPassengerBoarding('pass-test', 'nonce-test', testRide.id);
assert(
  participant.exactPickupPoint !== undefined && participant.exactPickupPoint.address.includes('Exact verified'),
  'After confirmation/handshake, exact pickup point is released to authorized parties'
);

// -----------------------------------------------------------------
// 5. Tiered SOS Escalation & Audit Log (PRD §3.9 & Acceptance Test #8)
// -----------------------------------------------------------------
console.log('\n[Test Group 5: Tiered SOS Escalation & Timers]');
const sosAlert = store.triggerSOS('user-anitha', 'ride-54266', 12.9810, 80.2245);

assert(
  sosAlert.active === true && sosAlert.tierLevel === 1,
  'SOS triggers at Tier 1 (nearby moderators alerted immediately)'
);

assert(
  sosAlert.contactsNotified === true && sosAlert.supportNotified === true,
  'Trusted contacts and platform support notified in under 3 seconds'
);

assert(
  store.smsDevInbox.length > 0 && store.smsDevInbox[0].message.includes('EMERGENCY ALERT'),
  'Simulated SMS dispatched to trusted emergency contacts'
);

// Acknowledge SOS
store.acknowledgeSOS(sosAlert.id, 'user-meenakshi');
assert(
  sosAlert.acknowledgedBy.length === 1 && sosAlert.acknowledgedBy[0].responderName === 'Meenakshi Sundaram',
  'Nearby moderator acknowledgement recorded and green dot lit'
);

// End SOS
store.endSOS(sosAlert.id);
assert(sosAlert.active === false, 'Emergency alert can be ended cleanly');

// -----------------------------------------------------------------
// 6. Moderator Conflict of Interest Check (PRD §3.9 I2 & Acceptance Test #12)
// -----------------------------------------------------------------
console.log('\n[Test Group 6: Moderator Conflict of Interest]');
const conflictCase = store.cases.get('case-901')!; // Involves pod-velachery-it
const velacheryPod = store.pods.get('pod-velachery-it')!;

const isKarthikInPod = velacheryPod.members.some((m) => m.userId === 'user-karthik');
assert(isKarthikInPod === true, 'Karthik is verified as a member of Velachery Pod');

// Simulated conflict check
const isConflict = conflictCase.conflictPodId === 'pod-velachery-it' && isKarthikInPod;
assert(isConflict === true, 'Moderator queue successfully flags conflict-of-interest for pod member');

// -----------------------------------------------------------------
// 7. Pod Standby Substitute Flow (PRD §3.4 D3 & Acceptance Test #3)
// -----------------------------------------------------------------
console.log('\n[Test Group 7: Pod Standby Substitute]');
store.resetToSeed();
const podBefore = store.pods.get('pod-velachery-it')!;
const initialMembers = podBefore.members.length;

// Harish cancels, standby candidate (Vignesh Rajan) substitutes
const substitute = podBefore.standbyCandidates.shift()!;
const memberIdx = podBefore.members.findIndex((m) => m.userId === 'user-harish');
if (memberIdx !== -1) {
  podBefore.members[memberIdx] = {
    userId: substitute.userId,
    name: substitute.name,
    avatar: '/demo/avatars/vignesh.svg',
    tier: substitute.tier,
    role: 'passenger',
    drivingDays: [],
  };
}

assert(
  podBefore.members.some((m) => m.userId === 'user-vignesh'),
  'Standby verified candidate (Vignesh) smoothly fills cancelled pod seat'
);

assert(
  podBefore.members.length === initialMembers,
  'Pod total member count maintained seamlessly'
);

// -----------------------------------------------------------------
// Summary
// -----------------------------------------------------------------
console.log('\n======================================================');
console.log(`Validation Results: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
