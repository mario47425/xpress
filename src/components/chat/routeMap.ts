import { AllowedChatTarget, ChatAction } from '../../types/chat';

export interface RouteTargetMeta {
  path: string;
  defaultLabel: string;
  roleChange?: 'passenger' | 'rider';
}

export const ROUTE_TARGET_MAP: Record<AllowedChatTarget, RouteTargetMeta> = {
  ghost_commutes: {
    path: '/app',
    defaultLabel: 'View Ghost Commutes',
    roleChange: 'passenger',
  },
  pods: {
    path: '/app/pods',
    defaultLabel: 'Go to Pods',
  },
  hotspots: {
    path: '/app/map',
    defaultLabel: 'Explore Hotspots',
  },
  relay_journey: {
    path: '/app/relay',
    defaultLabel: 'Plan Relay Journey',
    roleChange: 'passenger',
  },
  safetrail: {
    path: '/safety',
    defaultLabel: 'Open SafeTrail',
  },
  trust_ranking: {
    path: '/app/profile',
    defaultLabel: 'View Trust Ranking',
  },
  community_sos: {
    path: '/moderator',
    defaultLabel: 'Community SOS',
  },
  profile: {
    path: '/app/profile',
    defaultLabel: 'Go to Profile',
  },
  home: {
    path: '/app',
    defaultLabel: 'Home',
  },
  ride_mode: {
    path: '/app',
    defaultLabel: 'Switch to Ride Mode',
    roleChange: 'passenger',
  },
  drive_mode: {
    path: '/rider',
    defaultLabel: 'Switch to Drive Mode',
    roleChange: 'rider',
  },
  settings: {
    path: '/safety',
    defaultLabel: 'App Settings',
  },
  login: {
    path: '/onboarding',
    defaultLabel: 'Login / Onboarding',
  },
  qr_pass: {
    path: '/app/pickup-qr',
    defaultLabel: 'View QR Journey Pass',
    roleChange: 'passenger',
  },
  create_pod: {
    path: '/app/pods',
    defaultLabel: 'Create a Pod',
  },
};

export function resolveActionNavigation(
  action: ChatAction,
  activeRole: 'passenger' | 'rider'
): { path: string; roleChange?: 'passenger' | 'rider' } | null {
  const meta = ROUTE_TARGET_MAP[action.target];
  if (!meta) return null;

  let path = meta.path;
  let roleChange = meta.roleChange;

  // Adapt paths if current role is rider (driver)
  if (action.target === 'pods' && activeRole === 'rider') {
    path = '/rider/pods';
  } else if (action.target === 'profile' && activeRole === 'rider') {
    path = '/rider/profile';
  } else if (action.target === 'trust_ranking' && activeRole === 'rider') {
    path = '/rider/profile';
  } else if (action.target === 'home' && activeRole === 'rider') {
    path = '/rider';
  }

  return { path, roleChange };
}
