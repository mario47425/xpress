import { create } from 'zustand';
import { ChatMessage, ChatAction, ChatContextPayload, ChatApiResponse } from '../types/chat';

interface ChatStoreState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  hasSeenTooltip: boolean;
  lastFailedContext: ChatContextPayload | null;

  // Actions
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  dismissTooltip: () => void;
  sendMessage: (text: string, context: ChatContextPayload) => Promise<void>;
  retryLast: () => Promise<void>;
  clearChat: () => void;
  sendPrefilled: (text: string, context: ChatContextPayload) => Promise<void>;
}

const STORAGE_KEY = 'cc_chat_messages_session';
const TOOLTIP_KEY = 'cc_chat_tooltip_seen';

function loadSessionMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.slice(-20);
      }
    }
  } catch {}
  return [];
}

function saveSessionMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  } catch {}
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  isOpen: false,
  messages: loadSessionMessages(),
  isLoading: false,
  error: null,
  hasSeenTooltip: (() => {
    try {
      return localStorage.getItem(TOOLTIP_KEY) === 'true';
    } catch {
      return false;
    }
  })(),
  lastFailedContext: null,

  toggleOpen: () => {
    const current = get().isOpen;
    if (!current && !get().hasSeenTooltip) {
      get().dismissTooltip();
    }
    set({ isOpen: !current });
  },

  setOpen: (open: boolean) => {
    if (open && !get().hasSeenTooltip) {
      get().dismissTooltip();
    }
    set({ isOpen: open });
  },

  dismissTooltip: () => {
    try {
      localStorage.setItem(TOOLTIP_KEY, 'true');
    } catch {}
    set({ hasSeenTooltip: true });
  },

  sendMessage: async (text: string, context: ChatContextPayload) => {
    const trimmed = text.trim();
    if (!trimmed || get().isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    const updatedMessages = [...get().messages, userMessage].slice(-20);
    saveSessionMessages(updatedMessages);

    set({
      messages: updatedMessages,
      isLoading: true,
      error: null,
      lastFailedContext: context,
    });

    try {
      // Prepare message history for backend (last ~10 messages)
      const apiPayloadMessages = updatedMessages.slice(-10).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiPayloadMessages,
          context: {
            currentRoute: context.currentRoute,
            mode: context.mode,
            isLoggedIn: context.isLoggedIn,
          },
        }),
      });

      if (!res.ok) {
        let errMessage = 'I am having trouble connecting right now, please try again.';
        try {
          const errData = await res.json();
          if (errData?.message) errMessage = errData.message;
        } catch {}
        throw new Error(errMessage);
      }

      const data: ChatApiResponse = await res.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'bot',
        text: data.reply || "I'm here to help with your commute!",
        actions: data.actions || [],
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, botMessage].slice(-20);
      saveSessionMessages(finalMessages);

      set({
        messages: finalMessages,
        isLoading: false,
        error: null,
        lastFailedContext: null,
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      set({
        isLoading: false,
        error: err.message || 'Connection failed. Please retry.',
      });
    }
  },

  retryLast: async () => {
    const { messages, lastFailedContext, isLoading } = get();
    if (isLoading) return;

    // Find the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (!lastUserMsg) return;

    const ctx = lastFailedContext || {
      currentRoute: window.location.pathname,
      mode: 'ride',
      isLoggedIn: true,
    };

    set({ isLoading: true, error: null });

    try {
      const apiPayloadMessages = messages.slice(-10).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiPayloadMessages,
          context: {
            currentRoute: ctx.currentRoute,
            mode: ctx.mode,
            isLoggedIn: ctx.isLoggedIn,
          },
        }),
      });

      if (!res.ok) {
        let errMessage = 'Failed to connect. Please try again.';
        try {
          const errData = await res.json();
          if (errData?.message) errMessage = errData.message;
        } catch {}
        throw new Error(errMessage);
      }

      const data: ChatApiResponse = await res.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'bot',
        text: data.reply || "I'm here to help with your commute!",
        actions: data.actions || [],
        timestamp: Date.now(),
      };

      const finalMessages = [...messages, botMessage].slice(-20);
      saveSessionMessages(finalMessages);

      set({
        messages: finalMessages,
        isLoading: false,
        error: null,
        lastFailedContext: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Connection failed. Please retry.',
      });
    }
  },

  clearChat: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
    set({
      messages: [],
      error: null,
      isLoading: false,
      lastFailedContext: null,
    });
  },

  sendPrefilled: async (text: string, context: ChatContextPayload) => {
    set({ isOpen: true });
    await get().sendMessage(text, context);
  },
}));
