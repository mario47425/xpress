import { SYSTEM_PROMPT, ALLOWED_TARGETS } from '../server/chatbotConfig';
import {
  checkRateLimit,
  sanitizeResponse,
  generateLocalFallback,
} from '../server/chatService';
import { ROUTE_TARGET_MAP, resolveActionNavigation } from '../src/components/chat/routeMap';
import { ChatAction } from '../src/types/chat';

console.log('\n======================================================');
console.log('   CommuteCircle AI Chatbot & Groq Validation Suite   ');
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;

function assert(description: string, condition: boolean) {
  if (condition) {
    console.log(`  ✓ PASS: ${description}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${description}`);
    failCount++;
  }
}

// Group 1: Chatbot System Prompt & Allowed Targets
console.log('[Test Group 1: Chatbot System Prompt & Allowed Targets]');
assert(
  'System prompt includes CommuteCircle persona and core feature requirements',
  SYSTEM_PROMPT.includes('You are the CommuteCircle Assistant') &&
    SYSTEM_PROMPT.includes('Ghost Commutes') &&
    SYSTEM_PROMPT.includes('Recurring Pods') &&
    SYSTEM_PROMPT.includes('Pickup Hotspots') &&
    SYSTEM_PROMPT.includes('Relay Mode + QR') &&
    SYSTEM_PROMPT.includes('SafeTrail') &&
    SYSTEM_PROMPT.includes('Trust Ranking') &&
    SYSTEM_PROMPT.includes('Community Moderators')
);

assert(
  'Allowed targets include all required routes and modes',
  [
    'ghost_commutes',
    'pods',
    'hotspots',
    'relay_journey',
    'safetrail',
    'trust_ranking',
    'community_sos',
    'profile',
    'home',
    'ride_mode',
    'drive_mode',
    'settings',
    'login',
  ].every((t) => ALLOWED_TARGETS.includes(t as any))
);

assert(
  'Frontend route target map matches all allowed chatbot targets',
  ALLOWED_TARGETS.every((target) => !!ROUTE_TARGET_MAP[target])
);

// Group 2: Rate Limiting & Character Limit Constraints
console.log('\n[Test Group 2: Rate Limiting & Constraints]');
const testClientId = `test-client-${Date.now()}`;
let requestsAccepted = 0;

for (let i = 0; i < 25; i++) {
  if (checkRateLimit(testClientId)) {
    requestsAccepted++;
  }
}

assert(
  'Rate limit permits exactly 20 requests per minute per client',
  requestsAccepted === 20
);

// Group 3: Structured JSON Sanitization & Validation
console.log('\n[Test Group 3: Structured JSON Parsing & Disallowed Target Filtering]');
const validRawJson = JSON.stringify({
  reply: 'Taking you to your pods now.',
  actions: [
    { label: 'Go to Pods', type: 'navigate', target: 'pods' },
    { label: 'Invalid Hack Target', type: 'navigate', target: 'malicious_target_not_allowed' },
  ],
});

const sanitized = sanitizeResponse(validRawJson);
assert(
  'Sanitizer correctly extracts reply text',
  sanitized.reply === 'Taking you to your pods now.'
);
assert(
  'Sanitizer preserves valid allowed target (pods)',
  sanitized.actions.some((a) => a.target === 'pods')
);
assert(
  'Sanitizer filters out target not in ALLOWED_TARGETS',
  !sanitized.actions.some((a) => a.target === ('malicious_target_not_allowed' as any))
);

// Fallback handling when raw markdown fences are received
const fencedJson = '```json\n{"reply":"Fenced reply","actions":[{"label":"Home","type":"navigate","target":"home"}]}\n```';
const parsedFence = sanitizeResponse(fencedJson);
assert(
  'Sanitizer extracts JSON wrapped inside markdown code fences',
  parsedFence.reply === 'Fenced reply' && parsedFence.actions[0]?.target === 'home'
);

// Group 4: Intelligent Feature Navigation & Safety Responses
console.log('\n[Test Group 4: Navigation & Safety Handling for 8 Core Features]');

// 1. Ghost Commutes
const ghostResp = generateLocalFallback('How do Ghost Commutes work?');
assert(
  'Ghost Commute query returns explanation and ghost_commutes action',
  ghostResp.reply.includes('Ghost Commutes automatically predict') &&
    ghostResp.actions.some((a) => a.target === 'ghost_commutes')
);

// 2. Pods
const podsResp = generateLocalFallback('Take me to my pods');
assert(
  'Pods navigation command returns Go to Pods action',
  podsResp.actions.some((a) => a.target === 'pods')
);

// 3. Hotspots
const hotspotResp = generateLocalFallback('Where are the pickup hotspots?');
assert(
  'Hotspots query returns hotspots target',
  hotspotResp.actions.some((a) => a.target === 'hotspots')
);

// 4. Relay Mode
const relayResp = generateLocalFallback('Start a relay journey');
assert(
  'Relay query returns relay_journey target',
  relayResp.actions.some((a) => a.target === 'relay_journey')
);

// 5. SafeTrail & Emergency
const emergencyResp = generateLocalFallback('I am in danger, help me!');
assert(
  'Emergency phrase directs user to emergency services / SOS and SafeTrail',
  emergencyResp.reply.includes('112') &&
    emergencyResp.reply.includes('SOS button') &&
    emergencyResp.actions.some((a) => a.target === 'safetrail')
);

// 6. Mode Switch (Drive mode)
const driveResp = generateLocalFallback('Switch to Drive mode');
assert(
  'Drive mode switch request produces switch_mode action with drive_mode target',
  driveResp.actions.some((a) => a.type === 'switch_mode' && a.target === 'drive_mode')
);

// 7. Mode Switch (Ride mode)
const rideResp = generateLocalFallback('Switch to Ride mode');
assert(
  'Ride mode switch request produces switch_mode action with ride_mode target',
  rideResp.actions.some((a) => a.type === 'switch_mode' && a.target === 'ride_mode')
);

// 8. Trust Ranking & Badges
const trustResp = generateLocalFallback('How does trust ranking work?');
assert(
  'Trust ranking query returns trust_ranking action',
  trustResp.actions.some((a) => a.target === 'trust_ranking')
);

// 9. Community SOS & Moderator
const modResp = generateLocalFallback('What do community moderators do?');
assert(
  'Community moderator query returns community_sos action',
  modResp.actions.some((a) => a.target === 'community_sos')
);

// 10. Off-topic query rejection
const offTopicResp = generateLocalFallback('What is the capital of France and what is the weather?');
assert(
  'Off-topic question is politely declined with 0 actions',
  offTopicResp.reply.includes('only help with CommuteCircle') && offTopicResp.actions.length === 0
);

// Group 5: Route Target Resolution
console.log('\n[Test Group 5: Route Resolution & Role Switching]');

const navActionPods: ChatAction = { label: 'Go to Pods', type: 'navigate', target: 'pods' };
const resPassenger = resolveActionNavigation(navActionPods, 'passenger');
const resRider = resolveActionNavigation(navActionPods, 'rider');

assert(
  'Passenger pods action resolves to /app/pods',
  resPassenger?.path === '/app/pods'
);
assert(
  'Rider pods action resolves to /rider/pods',
  resRider?.path === '/rider/pods'
);

const switchDriveAction: ChatAction = {
  label: 'Switch to Drive Mode',
  type: 'switch_mode',
  target: 'drive_mode',
};
const resDrive = resolveActionNavigation(switchDriveAction, 'passenger');
assert(
  'Drive mode action resolves to /rider with rider role change',
  resDrive?.path === '/rider' && resDrive.roleChange === 'rider'
);

console.log('\n======================================================');
console.log(`Validation Results: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================\n');

if (failCount > 0) {
  process.exit(1);
}
