import { create } from 'zustand';
import {
  UserProfile,
  Ride,
  Hotspot,
  GhostPrediction,
  Pod,
  Wallet,
  JourneyPass,
  SOSAlert,
  ModeratorCase,
  AuditLogEntry,
} from '../types';
import { ScanVerificationResult } from '../../server/jwtService';

interface AppState {
  // Current session
  currentUser: UserProfile | null;
  users: UserProfile[];
  activeRole: 'passenger' | 'rider';
  isOffline: boolean;
  wsConnected: boolean;

  // Domain data
  hotspots: Hotspot[];
  rides: Ride[];
  liveRide: Ride | null;
  predictions: GhostPrediction[];
  pods: Pod[];
  wallet: Wallet | null;
  activePass: JourneyPass | null;
  activeSOS: SOSAlert | null;
  cases: ModeratorCase[];
  auditLog: AuditLogEntry[];

  // Scanning & Handshake
  lastScanResult: { result: ScanVerificationResult; pass?: JourneyPass } | null;

  // SafeTrail & Deviation Check-in
  checkInActive: boolean;
  checkInReason: string;
  checkInCountdown: number;

  // Actions
  init: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  switchRole: (role: 'passenger' | 'rider') => void;
  confirmPrediction: (predId: string) => Promise<void>;
  skipPrediction: (predId: string) => Promise<void>;
  markHotspotWaiting: (hotspotId: string) => Promise<void>;
  createPass: (legs: any[]) => Promise<JourneyPass>;
  refreshPass: () => Promise<void>;
  scanPass: (tokenOrCode: string) => Promise<ScanVerificationResult>;
  acceptPassenger: (passId: string, nonce: string, rideId: string) => Promise<void>;
  triggerSOS: (lat?: number, lng?: number) => Promise<void>;
  acknowledgeSOS: (alertId: string) => Promise<void>;
  endSOS: (alertId: string) => Promise<void>;
  respondCheckIn: (isSafe: boolean) => void;
  topUpWallet: (amount: number) => Promise<void>;
  reviewCase: (caseId: string, action: string, notes?: string) => Promise<void>;
  simulateGpsStep: (lat: number, lng: number, isDeviation?: boolean) => Promise<void>;
  resetData: () => Promise<void>;
}

let wsInstance: WebSocket | null = null;
let checkInInterval: any = null;

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  activeRole: 'passenger',
  isOffline: !navigator.onLine,
  wsConnected: false,

  hotspots: [],
  rides: [],
  liveRide: null,
  predictions: [],
  pods: [],
  wallet: null,
  activePass: null,
  activeSOS: null,
  cases: [],
  auditLog: [],
  lastScanResult: null,

  checkInActive: false,
  checkInReason: '',
  checkInCountdown: 60,

  init: async () => {
    try {
      // 1. Fetch Users
      const uRes = await fetch('/api/users');
      const users: UserProfile[] = await uRes.json();
      // Default to Anitha (Passenger) or Karthik (Rider)
      const defaultUser = users.find((u) => u.id === 'user-anitha') || users[0];

      // 2. Fetch Hotspots, Rides, Pods, Cases
      const [hRes, rRes, pRes, cRes, aRes] = await Promise.all([
        fetch('/api/hotspots'),
        fetch('/api/rides'),
        fetch('/api/pods'),
        fetch('/api/cases'),
        fetch('/api/audit-log'),
      ]);

      const hotspots = await hRes.json();
      const rides = await rRes.json();
      const pods = await pRes.json();
      const cases = await cRes.json();
      const auditLog = await aRes.json();

      const liveRide = rides.find((r: Ride) => r.id === 'ride-54266') || rides[0] || null;

      // 3. Fetch User specific predictions & wallet
      const predRes = await fetch(`/api/predictions/${defaultUser.id}`);
      const predictions = await predRes.json();

      const wRes = await fetch(`/api/wallets/${defaultUser.id}`);
      const wallet = await wRes.json();

      // Check active SOS
      const sosRes = await fetch('/api/sos/active');
      const activeSOSList: SOSAlert[] = await sosRes.json();
      const activeSOS = activeSOSList.length > 0 ? activeSOSList[0] : null;

      set({
        users,
        currentUser: defaultUser,
        activeRole: defaultUser.activeRole || 'passenger',
        hotspots,
        rides,
        liveRide,
        predictions,
        pods,
        cases,
        auditLog,
        wallet,
        activeSOS,
      });

      // 4. Connect WebSocket
      const connectWS = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        wsInstance = new WebSocket(wsUrl);

        wsInstance.onopen = () => {
          set({ wsConnected: true, isOffline: false });
        };

        wsInstance.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const { type, payload } = data;

            if (type === 'RIDE_UPDATED') {
              set((state) => ({
                rides: state.rides.map((r) => (r.id === payload.id ? payload : r)),
                liveRide: state.liveRide?.id === payload.id ? payload : state.liveRide,
              }));
            } else if (type === 'LOCATION_PING') {
              set((state) => {
                if (state.liveRide && state.liveRide.id === payload.rideId) {
                  return {
                    liveRide: {
                      ...state.liveRide,
                      currentRiderPosition: { lat: payload.lat, lng: payload.lng },
                    },
                  };
                }
                return state;
              });
            } else if (type === 'CHECKIN_PROMPT') {
              get().respondCheckIn(false); // start checkin countdown
              set({
                checkInActive: true,
                checkInReason: payload.reason || 'Route deviation detected',
                checkInCountdown: 60,
              });

              if (checkInInterval) clearInterval(checkInInterval);
              checkInInterval = setInterval(() => {
                set((state) => {
                  if (state.checkInCountdown <= 1) {
                    clearInterval(checkInInterval);
                    // PRD §3.7: No reply in 60s -> trigger SOS automatically
                    get().triggerSOS();
                    return { checkInActive: false, checkInCountdown: 0 };
                  }
                  return { checkInCountdown: state.checkInCountdown - 1 };
                });
              }, 1000);
            } else if (type === 'SOS_TRIGGERED' || type === 'SOS_ACKNOWLEDGED') {
              set({ activeSOS: payload });
            } else if (type === 'SOS_ENDED') {
              set({ activeSOS: null });
            } else if (type === 'HOTSPOT_UPDATE') {
              set((state) => ({
                hotspots: state.hotspots.map((h) => (h.id === payload.id ? payload : h)),
              }));
            } else if (type === 'PREDICTION_CONFIRMED' || type === 'PREDICTION_SKIPPED') {
              set((state) => ({
                predictions: state.predictions.map((p) => (p.id === payload.id ? payload : p)),
              }));
            } else if (type === 'POD_UPDATED') {
              set((state) => ({
                pods: state.pods.map((p) => (p.id === payload.id ? payload : p)),
              }));
            } else if (type === 'DATA_RESET') {
              get().init();
            }
          } catch (err) {
            console.error('WS parse error', err);
          }
        };

        wsInstance.onclose = () => {
          set({ wsConnected: false });
          setTimeout(connectWS, 3000);
        };
      };

      connectWS();

      window.addEventListener('online', () => set({ isOffline: false }));
      window.addEventListener('offline', () => set({ isOffline: true }));
    } catch (err) {
      console.error('Init error', err);
    }
  },

  switchUser: async (userId: string) => {
    const user = get().users.find((u) => u.id === userId);
    if (!user) return;
    const [pRes, wRes] = await Promise.all([
      fetch(`/api/predictions/${userId}`),
      fetch(`/api/wallets/${userId}`),
    ]);
    const predictions = await pRes.json();
    const wallet = await wRes.json();

    set({
      currentUser: user,
      activeRole: user.activeRole || 'passenger',
      predictions,
      wallet,
    });
  },

  switchRole: (role: 'passenger' | 'rider') => {
    set((state) => {
      if (state.currentUser) {
        state.currentUser.activeRole = role;
      }
      return { activeRole: role };
    });
  },

  confirmPrediction: async (predId: string) => {
    const res = await fetch(`/api/predictions/${predId}/confirm`, { method: 'POST' });
    const pred = await res.json();
    set((state) => ({
      predictions: state.predictions.map((p) => (p.id === predId ? pred : p)),
    }));
  },

  skipPrediction: async (predId: string) => {
    const res = await fetch(`/api/predictions/${predId}/skip`, { method: 'POST' });
    const pred = await res.json();
    set((state) => ({
      predictions: state.predictions.map((p) => (p.id === predId ? pred : p)),
    }));
  },

  markHotspotWaiting: async (hotspotId: string) => {
    const user = get().currentUser;
    await fetch(`/api/hotspots/${hotspotId}/wait`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id, delta: 1 }),
    });
  },

  createPass: async (legs: any[]) => {
    const user = get().currentUser;
    const res = await fetch('/api/journey-pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passengerId: user?.id, legs }),
    });
    const pass = await res.json();
    set({ activePass: pass });
    return pass;
  },

  refreshPass: async () => {
    const pass = get().activePass;
    if (!pass) return;
    const res = await fetch(`/api/journey-pass/${pass.id}/refresh`, { method: 'POST' });
    if (res.ok) {
      const updated = await res.json();
      set({ activePass: updated });
    }
  },

  scanPass: async (tokenOrCode: string) => {
    const user = get().currentUser;
    const liveRide = get().liveRide;
    const res = await fetch('/api/journey-pass/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokenOrCode,
        riderId: user?.id,
        assignedRideId: liveRide?.id,
        coPresenceCheckPassed: true,
      }),
    });
    const data = await res.json();
    set({ lastScanResult: data });
    return data.result;
  },

  acceptPassenger: async (passId: string, nonce: string, rideId: string) => {
    await fetch('/api/journey-pass/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passId, nonce, rideId }),
    });
  },

  triggerSOS: async (lat?: number, lng?: number) => {
    const user = get().currentUser;
    const liveRide = get().liveRide;
    const res = await fetch('/api/sos/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: user?.id,
        rideId: liveRide?.id,
        lat: lat || liveRide?.currentRiderPosition?.lat || 12.9810,
        lng: lng || liveRide?.currentRiderPosition?.lng || 80.2245,
      }),
    });
    const alert = await res.json();
    set({ activeSOS: alert });
  },

  acknowledgeSOS: async (alertId: string) => {
    const user = get().currentUser;
    const res = await fetch(`/api/sos/${alertId}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responderId: user?.id }),
    });
    const alert = await res.json();
    set({ activeSOS: alert });
  },

  endSOS: async (alertId: string) => {
    await fetch(`/api/sos/${alertId}/end`, { method: 'POST' });
    set({ activeSOS: null });
  },

  respondCheckIn: (isSafe: boolean) => {
    if (checkInInterval) clearInterval(checkInInterval);
    if (isSafe) {
      set({ checkInActive: false, checkInCountdown: 60 });
    } else {
      set({ checkInActive: false });
      get().triggerSOS();
    }
  },

  topUpWallet: async (amount: number) => {
    const user = get().currentUser;
    const res = await fetch(`/api/wallets/${user?.id}/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const wallet = await res.json();
    set({ wallet });
  },

  reviewCase: async (caseId: string, action: string, notes?: string) => {
    const user = get().currentUser;
    const res = await fetch(`/api/cases/${caseId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moderatorId: user?.id,
        moderatorName: user?.name,
        action,
        notes,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      set((state) => ({
        cases: state.cases.map((c) => (c.id === caseId ? data.case : c)),
        auditLog: [data.auditEntry, ...state.auditLog],
      }));
    } else {
      const err = await res.json();
      alert(err.error || 'Review failed');
    }
  },

  simulateGpsStep: async (lat: number, lng: number, isDeviation: boolean = false) => {
    const liveRide = get().liveRide;
    if (!liveRide) return;
    await fetch('/api/dev/simulate-gps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rideId: liveRide.id, lat, lng, isDeviation }),
    });
  },

  resetData: async () => {
    await fetch('/api/dev/reset', { method: 'POST' });
    await get().init();
  },
}));
