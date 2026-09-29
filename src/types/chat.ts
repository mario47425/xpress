export type AllowedChatTarget =
  | 'ghost_commutes'
  | 'pods'
  | 'hotspots'
  | 'relay_journey'
  | 'safetrail'
  | 'trust_ranking'
  | 'community_sos'
  | 'profile'
  | 'home'
  | 'ride_mode'
  | 'drive_mode'
  | 'settings'
  | 'login'
  | 'qr_pass'
  | 'create_pod';

export interface ChatAction {
  label: string;
  type: 'navigate' | 'switch_mode';
  target: AllowedChatTarget;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  actions?: ChatAction[];
  timestamp: number;
  error?: boolean;
}

export interface ChatContextPayload {
  currentRoute: string;
  mode: 'ride' | 'drive';
  isLoggedIn: boolean;
}

export interface ChatApiResponse {
  reply: string;
  actions: ChatAction[];
  error?: string;
  message?: string;
}
