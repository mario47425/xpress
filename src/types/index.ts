// CommuteCircle Domain Models & Typed Interfaces

export type TrustTier = 'Newcomer' | 'Trusted' | 'Verified Guardian' | 'Community Anchor';

export interface TrustBreakdown {
  safety: number; // 35% weight
  reliability: number; // 25% weight
  peerFeedback: number; // 15% weight
  verificationLevel: number; // 10% weight
  consistency: number; // 10% weight
  rideCount: number; // 5% weight
  totalScore: number; // 0-100
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role: 'passenger' | 'rider' | 'both';
  activeRole: 'passenger' | 'rider';
  tier: TrustTier;
  trustScore: number;
  trustBreakdown: TrustBreakdown;
  streak: number;
  cleanRides: number;
  badges: string[];
  homeZone: string; // Fuzzy geohash or neighbourhood
  workZone: string; // Fuzzy geohash or campus/tech park
  genderPref: 'any' | 'women-only';
  gender: 'female' | 'male' | 'other';
  safeRoutePref: boolean;
  minTierFilter: TrustTier;
  verificationSteps: {
    phoneOtp: boolean;
    collegeOrEmployerId: boolean;
    govtId: boolean;
    selfieMatch: boolean;
  };
  trustedContacts: { id: string; name: string; phone: string }[];
  isModerator?: boolean;
  responderActive?: boolean;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  makeModel: string;
  type: 'hatchback' | 'sedan' | 'suv';
  plate: string;
  seats: number;
  fuelType: 'petrol' | 'diesel' | 'ev' | 'cng';
  mileageKmPerLitre: number;
  licenseDocUrl: string;
  approved: boolean;
}

export interface Hotspot {
  id: string;
  name: string;
  category: 'metro' | 'bus_terminus' | 'junction' | 'campus_gate';
  lat: number;
  lng: number;
  lit: boolean;
  legalStopping: boolean;
  waitingCount: number;
  historicalConfidence: number; // 0-100
  avgWaitMins: number;
}

export type RideStatus =
  | 'PROPOSED'
  | 'CONFIRMED'
  | 'WAITING'
  | 'VERIFIED'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'SOS';

export interface RideParticipant {
  userId: string;
  name: string;
  avatar: string;
  tier: TrustTier;
  pickupHotspotId: string;
  pickupName: string;
  pickupLat: number;
  pickupLng: number;
  exactPickupPoint?: { lat: number; lng: number; address: string };
  dropName: string;
  dropLat: number;
  dropLng: number;
  status: 'confirmed' | 'waiting' | 'onboard' | 'dropped';
  fareShare: number;
  fareReason: string;
}

export interface Ride {
  id: string;
  riderId: string;
  riderName: string;
  riderAvatar: string;
  riderTier: TrustTier;
  vehicle: Vehicle;
  originName: string;
  originLat: number;
  originLng: number;
  destName: string;
  destLat: number;
  destLng: number;
  departureTime: string;
  corridor: string;
  status: RideStatus;
  participants: RideParticipant[];
  rideCode: string; // 4-digit mutual verification code e.g. "4821"
  costCappedTotal: number;
  actualCost: number;
  costRecovered: number;
  routePolyline?: [number, number][];
  currentRiderPosition?: { lat: number; lng: number; heading?: number };
}

export interface GhostPrediction {
  id: string;
  userId: string;
  targetRole: 'passenger' | 'rider';
  date: string;
  time: string;
  origin: string;
  destination: string;
  corridor: string;
  confidence: number; // 0-100
  ridersCount?: number;
  seatsOffered?: number;
  estimatedCostShare: number;
  status: 'proposed' | 'confirmed' | 'skipped';
}

export interface PodMember {
  userId: string;
  name: string;
  avatar: string;
  tier: TrustTier;
  role: 'driver' | 'passenger';
  drivingDays: string[]; // e.g. ['Mon', 'Wed']
}

export interface Pod {
  id: string;
  name: string;
  corridor: string;
  members: PodMember[];
  todayDriverId: string;
  reputation: number; // 0-100
  totalMoneySaved: number;
  totalCo2SavedKg: number;
  streakCount: number;
  isWomenOnly: boolean;
  standbyCandidates: { userId: string; name: string; tier: TrustTier }[];
}

export interface PassLeg {
  legNumber: number;
  mode: 'pool' | 'bus' | 'walk' | 'metro';
  startPointName: string;
  startLat: number;
  startLng: number;
  endPointName: string;
  endLat: number;
  endLng: number;
  plannedTime: string;
  assignedRideId?: string;
  assignedRiderName?: string;
  assignedVehiclePlate?: string;
  fare: number;
  status: 'upcoming' | 'current' | 'completed';
}

export interface JourneyPass {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerAvatar: string;
  passengerTier: TrustTier;
  jwtToken: string;
  shortCode: string; // 6 characters
  createdAt: string;
  expiresAt: string;
  legs: PassLeg[];
  currentLegIndex: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  description: string;
  amount: number;
  type: 'topup' | 'fare_debit' | 'cost_recovery_credit' | 'fee_debit' | 'refund';
  rideId?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  ledger: LedgerEntry[];
}

export interface SOSAlert {
  id: string;
  rideId?: string;
  senderId: string;
  senderName: string;
  lat: number;
  lng: number;
  timestamp: string;
  active: boolean;
  tierLevel: 1 | 2; // 1 = nearby moderators, 2 = all nearby verified
  escalationSeconds: number; // 60s countdown to tier 2
  acknowledgedBy: { responderId: string; responderName: string; distanceMeters: number; etaMins: number }[];
  contactsNotified: boolean;
  supportNotified: boolean;
}

export interface ModeratorCase {
  id: string;
  type: 'flagged_ride' | 'dispute' | 'hotspot_nomination' | 'vouch_request';
  status: 'pending' | 'approved' | 'dismissed' | 'escalated';
  anonymisedUserA: string;
  anonymisedUserB?: string;
  reason: string;
  details: string;
  submittedAt: string;
  conflictPodId?: string;
}

export interface AuditLogEntry {
  id: string;
  moderatorId: string;
  moderatorName: string;
  caseId: string;
  action: string;
  timestamp: string;
  notes?: string;
}
