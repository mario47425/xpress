import {
  UserProfile,
  Vehicle,
  Hotspot,
  Ride,
  GhostPrediction,
  Pod,
  Wallet,
  ModeratorCase,
  AuditLogEntry,
  JourneyPass,
  PassLeg,
  SOSAlert,
} from '../src/types';
import {
  SEED_USERS,
  SEED_VEHICLES,
  SEED_HOTSPOTS,
  SEED_GHOST_PREDICTIONS,
  SEED_PODS,
  SEED_LIVE_RIDE,
  SEED_WALLETS,
  SEED_MODERATOR_CASES,
  SEED_AUDIT_LOG,
} from '../src/demo/chennaiSeed';
import {
  signJourneyPass,
  verifyJourneyPass,
  burnNonce,
  generateShortCode,
  ScanVerificationResult,
} from './jwtService';

export class AppStore {
  users: Map<string, UserProfile> = new Map();
  vehicles: Map<string, Vehicle> = new Map();
  hotspots: Map<string, Hotspot> = new Map();
  rides: Map<string, Ride> = new Map();
  predictions: Map<string, GhostPrediction> = new Map();
  pods: Map<string, Pod> = new Map();
  wallets: Map<string, Wallet> = new Map();
  cases: Map<string, ModeratorCase> = new Map();
  auditLog: AuditLogEntry[] = [];
  journeyPasses: Map<string, JourneyPass> = new Map();
  shortCodeIndex: Map<string, string> = new Map(); // shortCode -> passId
  activeSOS: Map<string, SOSAlert> = new Map();
  smsDevInbox: { id: string; to: string; message: string; timestamp: string }[] = [];

  // Escalation timers
  sosTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.resetToSeed();
  }

  resetToSeed() {
    // Clear all
    this.users.clear();
    this.vehicles.clear();
    this.hotspots.clear();
    this.rides.clear();
    this.predictions.clear();
    this.pods.clear();
    this.wallets.clear();
    this.cases.clear();
    this.auditLog = [];
    this.journeyPasses.clear();
    this.shortCodeIndex.clear();
    this.activeSOS.clear();
    this.smsDevInbox = [];

    // Clear timers
    for (const t of this.sosTimers.values()) clearTimeout(t);
    this.sosTimers.clear();

    // Populate deep clones
    SEED_USERS.forEach((u) => this.users.set(u.id, JSON.parse(JSON.stringify(u))));
    SEED_VEHICLES.forEach((v) => this.vehicles.set(v.id, JSON.parse(JSON.stringify(v))));
    SEED_HOTSPOTS.forEach((h) => this.hotspots.set(h.id, JSON.parse(JSON.stringify(h))));
    SEED_GHOST_PREDICTIONS.forEach((g) => this.predictions.set(g.id, JSON.parse(JSON.stringify(g))));
    SEED_PODS.forEach((p) => this.pods.set(p.id, JSON.parse(JSON.stringify(p))));
    this.rides.set(SEED_LIVE_RIDE.id, JSON.parse(JSON.stringify(SEED_LIVE_RIDE)));
    Object.values(SEED_WALLETS).forEach((w) => this.wallets.set(w.userId, JSON.parse(JSON.stringify(w))));
    SEED_MODERATOR_CASES.forEach((c) => this.cases.set(c.id, JSON.parse(JSON.stringify(c))));
    this.auditLog = JSON.parse(JSON.stringify(SEED_AUDIT_LOG));

    // Seed default Journey Pass for Anitha on SEED_LIVE_RIDE
    this.createJourneyPass('user-anitha', [
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
        assignedRideId: SEED_LIVE_RIDE.id,
        assignedRiderName: 'Karthik Subramanian',
        assignedVehiclePlate: 'TN 09 AB 4821',
        fare: 28,
        status: 'current',
      },
    ]);
  }

  // --- FARE CALCULATION ENGINE (PRD §6.2) ---
  calculateFairFare(params: {
    fuelRatePerLitre: number; // e.g. 102.63 INR petrol
    mileageKmPerLitre: number; // e.g. 15 km/l
    routeDistanceKm: number; // e.g. 8.5 km
    tollAmount: number; // e.g. 0
    detourKm: number; // e.g. 0.8 km
    totalOccupants: number; // including rider, e.g. 3
  }) {
    const { fuelRatePerLitre, mileageKmPerLitre, routeDistanceKm, tollAmount, detourKm, totalOccupants } = params;
    // Trip total cost C
    const tripCostC = (fuelRatePerLitre * routeDistanceKm) / mileageKmPerLitre + tollAmount;
    // Detour weighted share
    const baseShare = tripCostC / Math.max(1, totalOccupants);
    const detourCost = (fuelRatePerLitre * detourKm) / mileageKmPerLitre;
    const finalFare = Math.round(baseShare + detourCost * 0.5);

    const reason = `Your fare is Rs ${finalFare} (base share Rs ${Math.round(baseShare)} + Rs ${Math.round(detourCost * 0.5)} for ${detourKm.toFixed(1)} km detour offset).`;

    return {
      totalTripCost: Math.round(tripCostC),
      fareShare: finalFare,
      reason,
      platformFee: Math.round(finalFare * 0.05), // 5%
    };
  }

  // --- JOURNEY PASS ISSUANCE & VERIFICATION (PRD §4) ---
  createJourneyPass(passengerId: string, legs: PassLeg[]): JourneyPass {
    const passenger = this.users.get(passengerId);
    if (!passenger) throw new Error('Passenger not found');

    const passId = `pass-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nowSec = Math.floor(Date.now() / 1000);
    const shortCode = generateShortCode();

    const payload = {
      sub: passengerId,
      pid: passId,
      legs: legs.map((l) => ({
        legNumber: l.legNumber,
        mode: l.mode,
        startPointId: l.startPointName,
        endPointId: l.endPointName,
        plannedTime: l.plannedTime,
        assignedRideId: l.assignedRideId,
      })),
      cur: 0,
      nonce: `nonce-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      iat: nowSec,
      exp: nowSec + 60, // 60 seconds lifetime; refreshed every 30s
      sc: shortCode,
    };

    const jwtToken = signJourneyPass(payload);

    const pass: JourneyPass = {
      id: passId,
      passengerId,
      passengerName: passenger.name,
      passengerAvatar: passenger.avatar,
      passengerTier: passenger.tier,
      jwtToken,
      shortCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60000).toISOString(),
      legs,
      currentLegIndex: 0,
      status: 'active',
    };

    this.journeyPasses.set(passId, pass);
    this.shortCodeIndex.set(shortCode.toUpperCase(), passId);
    return pass;
  }

  refreshJourneyPass(passId: string): JourneyPass {
    const pass = this.journeyPasses.get(passId);
    if (!pass || pass.status !== 'active') throw new Error('Invalid or inactive pass');

    const nowSec = Math.floor(Date.now() / 1000);
    const newShortCode = generateShortCode();

    const payload = {
      sub: pass.passengerId,
      pid: pass.id,
      legs: pass.legs.map((l) => ({
        legNumber: l.legNumber,
        mode: l.mode,
        startPointId: l.startPointName,
        endPointId: l.endPointName,
        plannedTime: l.plannedTime,
        assignedRideId: l.assignedRideId,
      })),
      cur: pass.currentLegIndex,
      nonce: `nonce-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      iat: nowSec,
      exp: nowSec + 60,
      sc: newShortCode,
    };

    // Remove old shortcode mapping
    this.shortCodeIndex.delete(pass.shortCode);

    pass.jwtToken = signJourneyPass(payload);
    pass.shortCode = newShortCode;
    pass.expiresAt = new Date(Date.now() + 60000).toISOString();
    this.shortCodeIndex.set(newShortCode.toUpperCase(), pass.id);

    return pass;
  }

  scanJourneyPass(
    scannedText: string,
    riderId: string,
    assignedRideId?: string,
    coPresenceCheckPassed: boolean = true
  ): { result: ScanVerificationResult; pass?: JourneyPass } {
    let tokenToVerify = scannedText.trim();

    // Check if input is a 6-character short code fallback
    if (tokenToVerify.length <= 8 && !tokenToVerify.includes('.')) {
      const mappedPassId = this.shortCodeIndex.get(tokenToVerify.toUpperCase());
      if (mappedPassId) {
        const pass = this.journeyPasses.get(mappedPassId);
        if (pass) tokenToVerify = pass.jwtToken;
      }
    }

    const verificationResult = verifyJourneyPass(
      tokenToVerify,
      riderId,
      assignedRideId,
      coPresenceCheckPassed
    );

    if (verificationResult.success) {
      const pass = this.journeyPasses.get(verificationResult.payload.pid);
      return { result: verificationResult, pass };
    }

    return { result: verificationResult };
  }

  acceptPassengerBoarding(passId: string, nonce: string, rideId: string): { success: boolean; ride?: Ride } {
    burnNonce(nonce);
    const pass = this.journeyPasses.get(passId);
    if (pass) {
      const curLeg = pass.legs[pass.currentLegIndex];
      if (curLeg) curLeg.status = 'completed';
      if (pass.currentLegIndex + 1 < pass.legs.length) {
        pass.currentLegIndex += 1;
        pass.legs[pass.currentLegIndex].status = 'current';
      } else {
        pass.status = 'completed';
      }
    }

    const ride = this.rides.get(rideId);
    if (ride) {
      ride.status = 'VERIFIED';
      const participant = ride.participants.find((p) => p.userId === pass?.passengerId);
      if (participant) {
        participant.status = 'onboard';
        // Unlock exact pickup point
        participant.exactPickupPoint = {
          lat: participant.pickupLat + 0.0004,
          lng: participant.pickupLng + 0.0003,
          address: 'Exact verified pickup point confirmed by rider scan',
        };
      }
      return { success: true, ride };
    }
    return { success: false };
  }

  // --- SOS ESCLATION SYSTEM (PRD §3.9) ---
  triggerSOS(senderId: string, rideId?: string, lat: number = 12.9810, lng: number = 80.2245, onEscalate?: () => void): SOSAlert {
    const sender = this.users.get(senderId);
    const alertId = `sos-${Date.now()}`;

    const alert: SOSAlert = {
      id: alertId,
      rideId,
      senderId,
      senderName: sender?.name || 'Commuter in Distress',
      lat,
      lng,
      timestamp: new Date().toISOString(),
      active: true,
      tierLevel: 1, // Tier 1 (Moderators within 2 km)
      escalationSeconds: 60,
      acknowledgedBy: [],
      contactsNotified: true,
      supportNotified: true,
    };

    this.activeSOS.set(alertId, alert);

    if (rideId && this.rides.has(rideId)) {
      const r = this.rides.get(rideId)!;
      r.status = 'SOS';
    }

    // Add notification to SMS dev inbox for trusted contacts
    sender?.trustedContacts.forEach((c) => {
      this.smsDevInbox.unshift({
        id: `sms-${Date.now()}-${Math.random()}`,
        to: c.phone,
        message: `EMERGENCY ALERT from CommuteCircle: ${sender.name} triggered SOS near ${lat.toFixed(4)}, ${lng.toFixed(4)}. Emergency services 112 alerted. Track live: http://localhost:5173/sos/${alertId}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    // Tier 2 Escalation Timer (after 60 seconds)
    const timer = setTimeout(() => {
      if (this.activeSOS.has(alertId) && this.activeSOS.get(alertId)!.active) {
        const a = this.activeSOS.get(alertId)!;
        if (a.acknowledgedBy.length === 0) {
          a.tierLevel = 2; // Widened to all nearby verified community members
          if (onEscalate) onEscalate();
        }
      }
    }, 60000);

    this.sosTimers.set(alertId, timer);
    return alert;
  }

  acknowledgeSOS(alertId: string, responderId: string): SOSAlert | null {
    const alert = this.activeSOS.get(alertId);
    if (!alert || !alert.active) return null;

    const responder = this.users.get(responderId);
    if (!responder) return null;

    // Check if already acknowledged
    const exists = alert.acknowledgedBy.some((r) => r.responderId === responderId);
    if (!exists) {
      alert.acknowledgedBy.push({
        responderId,
        responderName: responder.name,
        distanceMeters: 650,
        etaMins: 2,
      });

      // Reward trust score for verified community help
      responder.trustScore = Math.min(100, responder.trustScore + 2);
    }

    return alert;
  }

  endSOS(alertId: string): boolean {
    const alert = this.activeSOS.get(alertId);
    if (!alert) return false;
    alert.active = false;
    const timer = this.sosTimers.get(alertId);
    if (timer) clearTimeout(timer);
    this.sosTimers.delete(alertId);

    if (alert.rideId && this.rides.has(alert.rideId)) {
      this.rides.get(alert.rideId)!.status = 'IN_TRANSIT';
    }
    return true;
  }
}

export const store = new AppStore();
