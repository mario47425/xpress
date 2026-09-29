import { SYSTEM_PROMPT, ALLOWED_TARGETS, ChatAction, ChatCompletionResponse, AllowedTarget } from './chatbotConfig';

// Load .env if supported natively
try {
  if (typeof (process as any).loadEnvFile === 'function') {
    (process as any).loadEnvFile();
  }
} catch (e) {
  // .env will be read directly if loadEnvFile is absent or file missing
}

// In-memory rate limiting: 20 messages per minute per client
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientId);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (record.count >= 20) {
    return false;
  }

  record.count++;
  return true;
}

export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatContextInput {
  currentRoute?: string;
  mode?: 'ride' | 'drive' | string;
  isLoggedIn?: boolean;
}

/**
 * Validates and sanitizes model output JSON
 */
export function sanitizeResponse(rawText: string): ChatCompletionResponse {
  try {
    // Attempt parsing as JSON
    const parsed = JSON.parse(rawText);
    const reply = typeof parsed.reply === 'string' ? parsed.reply : rawText;
    const actions: ChatAction[] = [];

    if (Array.isArray(parsed.actions)) {
      for (const act of parsed.actions) {
        if (
          act &&
          typeof act.label === 'string' &&
          (act.type === 'navigate' || act.type === 'switch_mode') &&
          ALLOWED_TARGETS.includes(act.target as AllowedTarget)
        ) {
          actions.push({
            label: act.label,
            type: act.type,
            target: act.target as AllowedTarget,
          });
        }
      }
    }

    return { reply, actions };
  } catch (err) {
    // If not JSON, extract reply text or use as is
    // Check if JSON was enclosed in markdown code fences
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return sanitizeResponse(jsonMatch[1]);
      } catch {}
    }

    return {
      reply: rawText.trim(),
      actions: [],
    };
  }
}

/**
 * Intelligent rule-based local fallback when Groq API key is not yet set or during offline/mock fallback
 */
export function generateLocalFallback(
  userQuery: string,
  context?: ChatContextInput
): ChatCompletionResponse {
  const q = userQuery.toLowerCase().trim();

  // 1. Emergency or unsafe keywords
  if (
    q.includes('emergency') ||
    q.includes('sos') ||
    q.includes('danger') ||
    q.includes('unsafe') ||
    q.includes('threat') ||
    q.includes('attack') ||
    q.includes('accident') ||
    q.includes('help me')
  ) {
    return {
      reply:
        "If you are in immediate danger, trigger the SOS button immediately or call local emergency services (112). You can also open SafeTrail to notify your trusted guardians and community responders.",
      actions: [
        { label: 'Open SafeTrail', type: 'navigate', target: 'safetrail' },
        { label: 'View SOS Alert', type: 'navigate', target: 'community_sos' },
      ],
    };
  }

  // 2. Ghost Commutes
  if (q.includes('ghost commute') || q.includes('ghost')) {
    return {
      reply:
        "Ghost Commutes automatically predict tomorrow's trips based on historical patterns and propose verified ride groups before anyone has to manually request one. You can confirm or snooze suggested matches in seconds.",
      actions: [
        { label: 'View Ghost Commutes', type: 'navigate', target: 'ghost_commutes' },
      ],
    };
  }

  // 3. Pods / Recurring Pods
  if (q.includes('pod') || q.includes('recurring pod')) {
    if (q.includes('create') || q.includes('start')) {
      return {
        reply:
          "You can form a Recurring Pod with 3-4 trusted co-commuters. Drivers rotate daily and standby riders step in automatically if someone is sick.",
        actions: [
          { label: 'Create a Pod', type: 'navigate', target: 'create_pod' },
          { label: 'Go to Pods', type: 'navigate', target: 'pods' },
        ],
      };
    }
    return {
      reply:
        "Recurring Pods are fixed groups of 3-4 daily commuters with scheduled driver rotations and standby riders. They guarantee high reliability with zero negotiation.",
      actions: [
        { label: 'Go to Pods', type: 'navigate', target: 'pods' },
      ],
    };
  }

  // 4. Relay Mode & QR Pass
  if (q.includes('relay') || q.includes('qr') || q.includes('pass') || q.includes('multimodal')) {
    return {
      reply:
        "Relay Mode splits your long commute into efficient multimodal legs (such as carpool to metro to walking). You travel with a single dynamic cryptographic QR Journey Pass that updates as each leg completes.",
      actions: [
        { label: 'Open Relay Planner', type: 'navigate', target: 'relay_journey' },
        { label: 'View QR Pass', type: 'navigate', target: 'qr_pass' },
      ],
    };
  }

  // 5. Hotspots
  if (q.includes('hotspot') || q.includes('pickup') || q.includes('fixed point') || q.includes('map')) {
    return {
      reply:
        "Pickup Hotspots are safe, well-lit, designated boarding points along high-traffic corridors like OMR and Velachery. Drivers pull in without detouring into narrow streets.",
      actions: [
        { label: 'Explore Hotspots', type: 'navigate', target: 'hotspots' },
      ],
    };
  }

  // 6. SafeTrail & Safety features
  if (q.includes('safetrail') || q.includes('safety') || q.includes('guardian') || q.includes('women')) {
    return {
      reply:
        "SafeTrail protects every trip with peer identity verification, route deviation alerts, guardian tracking, and women-only pod filters. Everything is monitored in real-time.",
      actions: [
        { label: 'Open SafeTrail', type: 'navigate', target: 'safetrail' },
      ],
    };
  }

  // 7. Trust Ranking & Badges
  if (q.includes('trust') || q.includes('ranking') || q.includes('tier') || q.includes('streak') || q.includes('reputation')) {
    return {
      reply:
        "Trust Ranking rewards punctual and safe commuters with tiers from Bronze to Platinum. High trust tiers unlock priority matching, women-only pods, and community moderator badges.",
      actions: [
        { label: 'View Trust Profile', type: 'navigate', target: 'trust_ranking' },
      ],
    };
  }

  // 8. Community Moderators & SOS Network
  if (q.includes('moderator') || q.includes('community sos') || q.includes('peer response')) {
    return {
      reply:
        "Community Moderators are Gold and Platinum members who volunteer to triage nearby safety alerts and audit ride deviations to keep the community secure.",
      actions: [
        { label: 'Open Community SOS', type: 'navigate', target: 'community_sos' },
      ],
    };
  }

  // 9. Switch Mode (Drive or Ride)
  if (q.includes('drive mode') || q.includes('switch to drive') || q.includes('offer ride') || q.includes('driver')) {
    return {
      reply:
        "You can switch between Ride and Drive mode anytime with one tap. Drive mode allows you to post vacant seats, view matching passengers, and recover fuel costs.",
      actions: [
        { label: 'Switch to Drive Mode', type: 'switch_mode', target: 'drive_mode' },
      ],
    };
  }

  if (q.includes('ride mode') || q.includes('switch to ride') || q.includes('passenger') || q.includes('book ride')) {
    return {
      reply:
        "Ride mode helps you discover nearby carpools, book seats on recurring pods, or plan multimodal relay journeys across Chennai.",
      actions: [
        { label: 'Switch to Ride Mode', type: 'switch_mode', target: 'ride_mode' },
      ],
    };
  }

  // 10. Navigation commands (take me to / open / go to ...)
  if (q.includes('take me to') || q.includes('open') || q.includes('navigate') || q.includes('go to')) {
    if (q.includes('pod')) return { reply: "Opening your Pods overview.", actions: [{ label: 'Go to Pods', type: 'navigate', target: 'pods' }] };
    if (q.includes('profile')) return { reply: "Here is your profile and trust standing.", actions: [{ label: 'View Profile', type: 'navigate', target: 'profile' }] };
    if (q.includes('map') || q.includes('hotspot')) return { reply: "Taking you to the live Hotspot corridor map.", actions: [{ label: 'Open Map', type: 'navigate', target: 'hotspots' }] };
    if (q.includes('relay')) return { reply: "Opening the multimodal Relay Journey Planner.", actions: [{ label: 'Plan Relay', type: 'navigate', target: 'relay_journey' }] };
    if (q.includes('safety') || q.includes('safetrail')) return { reply: "Navigating to SafeTrail Safety Centre.", actions: [{ label: 'Go to SafeTrail', type: 'navigate', target: 'safetrail' }] };
    if (q.includes('home')) return { reply: "Heading back to the Home dashboard.", actions: [{ label: 'Go to Home', type: 'navigate', target: 'home' }] };
    if (q.includes('settings')) return { reply: "Opening app settings & preferences.", actions: [{ label: 'Open Settings', type: 'navigate', target: 'settings' }] };
    if (q.includes('login') || q.includes('logout') || q.includes('switch user')) return { reply: "Taking you to authentication & onboarding.", actions: [{ label: 'Go to Login', type: 'navigate', target: 'login' }] };
  }

  // 11. Off-topic rejection (weather, coding, recipes, generic jokes, etc.)
  if (
    q.includes('weather') ||
    q.includes('recipe') ||
    q.includes('capital of') ||
    q.includes('write code') ||
    q.includes('python') ||
    q.includes('javascript') ||
    q.includes('movie') ||
    q.includes('song') ||
    q.includes('who won')
  ) {
    return {
      reply:
        "I can only help with CommuteCircle and commuting safety. Let me know if you need help with Ghost Commutes, Pods, Hotspots, or SafeTrail!",
      actions: [],
    };
  }

  // 12. Default friendly helper response
  return {
    reply:
      "Hello! I am your CommuteCircle Assistant. I can help you find rides, set up Ghost Commutes, join recurring pods, or navigate anywhere in the app. Where would you like to go?",
    actions: [
      { label: 'View Ghost Commutes', type: 'navigate', target: 'ghost_commutes' },
      { label: 'Explore Hotspots', type: 'navigate', target: 'hotspots' },
      { label: 'Go to Pods', type: 'navigate', target: 'pods' },
    ],
  };
}

/**
 * Calls the Groq Chat Completions API with fallback model and timeout
 */
export async function getGroqChatCompletion(
  messages: ChatMessageInput[],
  context?: ChatContextInput
): Promise<ChatCompletionResponse> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const primaryModel = process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile';
  const fallbackModel = process.env.GROQ_FALLBACK_MODEL?.trim() || 'llama-3.1-8b-instant';

  // If no API key configured or is placeholder, use the intelligent fallback
  if (!apiKey || apiKey === 'your_key_here' || apiKey === 'your_groq_api_key_here') {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    return generateLocalFallback(lastUserMsg, context);
  }

  // Context metadata injected into system prompt
  const contextDescription = `\nCurrent User Context:\n- Current Route: ${context?.currentRoute || '/app'}\n- Mode: ${context?.mode || 'Ride'}\n- Authenticated: ${context?.isLoggedIn ? 'Yes' : 'No'}\n`;
  const fullSystemPrompt = SYSTEM_PROMPT + contextDescription;

  // Build the message sequence for Groq
  const groqMessages = [
    { role: 'system', content: fullSystemPrompt },
    ...messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  // Try primary model, then fallback model
  const modelsToTry = [primaryModel, fallbackModel];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: groqMessages,
          temperature: 0.4,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Groq API error with model ${model}]: Status ${response.status}: ${errorText}`);

        if (response.status === 401) {
          throw new Error('GROQ_AUTH_ERROR: Invalid or expired GROQ_API_KEY.');
        }
        if (response.status === 429) {
          throw new Error('GROQ_RATE_LIMIT: Groq API rate limit exceeded.');
        }

        // Try next model if 404 or model not found
        lastError = new Error(`Groq returned ${response.status}: ${errorText}`);
        continue;
      }

      const data: any = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent) {
        throw new Error('Empty response from Groq API');
      }

      return sanitizeResponse(rawContent);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('REQUEST_TIMEOUT: Groq API took longer than 20 seconds to respond.');
      }
      lastError = err;
      if (err.message?.includes('GROQ_AUTH_ERROR') || err.message?.includes('GROQ_RATE_LIMIT')) {
        throw err;
      }
      // Otherwise continue to next model
    }
  }

  console.warn('[Groq API failed on all models, using local fallback handler]:', lastError?.message);
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  return generateLocalFallback(lastUserMsg, context);
}
