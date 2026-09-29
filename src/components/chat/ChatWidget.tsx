import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAppStore } from '../../store/useAppStore';
import { MarkdownRenderer } from './MarkdownRenderer';
import { resolveActionNavigation } from './routeMap';
import { ChatAction } from '../../types/chat';

const QUICK_CHIPS = [
  'How do Ghost Commutes work?',
  'Take me to my pods',
  'Start a relay journey',
  'How do I use SOS?',
  'Switch to Drive mode',
];

export const ChatWidget: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    error,
    hasSeenTooltip,
    toggleOpen,
    setOpen,
    dismissTooltip,
    sendMessage,
    retryLast,
    clearChat,
  } = useChatStore();

  const { activeRole, switchRole, currentUser } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll message list when messages change or loading state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened on desktop
  useEffect(() => {
    if (isOpen && window.innerWidth >= 768) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle Escape key to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    if (!textToSend) {
      setInput('');
    }

    const contextPayload = {
      currentRoute: location.pathname,
      mode: (activeRole === 'rider' ? 'drive' : 'ride') as 'ride' | 'drive',
      isLoggedIn: !!currentUser,
    };

    await sendMessage(text, contextPayload);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (action: ChatAction) => {
    const resolution = resolveActionNavigation(action, activeRole);
    if (!resolution) return;

    if (resolution.roleChange) {
      switchRole(resolution.roleChange);
    }

    navigate(resolution.path);

    // On mobile screens, minimize after navigating so the user sees the page
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* 1. Floating Round Chat Button + Tooltip */}
      <div
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end pointer-events-none select-none"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* First-time onboarding tooltip */}
        {!hasSeenTooltip && !isOpen && (
          <div className="pointer-events-auto mb-2 animate-bounce flex items-center gap-2 bg-text text-bg px-3.5 py-2 rounded-xl text-xs font-medium shadow-xl border border-border/40 relative">
            <span>Need help? Ask me anything</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissTooltip();
              }}
              className="text-text-muted hover:text-bg p-0.5"
              aria-label="Dismiss tooltip"
            >
              <X size={12} />
            </button>
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-text rotate-45" />
          </div>
        )}

        {/* Floating Round Action Button */}
        <button
          onClick={toggleOpen}
          aria-label={isOpen ? 'Close assistant' : 'Open CommuteCircle AI Assistant'}
          className={`pointer-events-auto w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
            isOpen
              ? 'bg-surface text-text border border-border shadow-md'
              : 'bg-primary hover:bg-primary-hover text-white shadow-primary/30 border border-blue-400/20 hover:scale-105'
          }`}
          style={{ minWidth: 44, minHeight: 44 }}
        >
          {isOpen ? (
            <X size={24} className="transition-transform duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle size={26} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-surface animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* 2. Chat Panel (Desktop Floating Card / Mobile Slide-up Bottom Sheet) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="CommuteCircle Assistant"
          aria-modal="true"
          className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end md:justify-end md:items-end md:p-6"
        >
          {/* Mobile backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="md:hidden pointer-events-auto fixed inset-0 bg-text/30 backdrop-blur-xs transition-opacity"
          />

          {/* Chat Window Container */}
          <div
            className="pointer-events-auto w-full md:w-[380px] h-[85vh] md:h-[560px] max-h-[85vh] md:max-h-[calc(100vh-6rem)] bg-surface rounded-t-2xl md:rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden relative font-sans z-50 animate-in slide-in-from-bottom duration-200"
          >
            {/* Header: Dark metallic header */}
            <div className="bg-surface-2 border-b border-border text-text px-4 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight tracking-tight text-text">
                    CommuteCircle Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="text-[11px] text-text-3 font-medium">Online · Groq AI</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    title="Clear chat history"
                    aria-label="Clear chat history"
                    className="p-2 text-text-3 hover:text-text hover:bg-surface-glow rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center text-xs gap-1"
                  >
                    <RotateCcw size={15} />
                    <span className="text-[11px] hidden sm:inline">Clear</span>
                  </button>
                )}

                <button
                  onClick={() => setOpen(false)}
                  title="Close assistant"
                  aria-label="Close assistant"
                  className="p-2 text-text-3 hover:text-text hover:bg-surface-glow rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <ChevronDown size={20} className="hidden md:block" />
                  <X size={20} className="md:hidden" />
                </button>
              </div>
            </div>

            {/* Scrollable Message List */}
            <div
              className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-bg/50 text-xs no-scrollbar"
              aria-live="polite"
            >
              {/* First-open Welcome Banner & Quick Chips */}
              {messages.length === 0 && (
                <div className="space-y-3 py-2 animate-in fade-in duration-300">
                  <div className="p-3.5 bg-surface-2 rounded-xl border border-border shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                      <Sparkles size={14} />
                      <span>Welcome to CommuteCircle Assistant</span>
                    </div>
                    <p className="text-text-2 text-xs leading-relaxed">
                      Ask aboutGhost Commutes, joining pods, scheduling relay routes, or quick navigation across the app.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-text-3 uppercase tracking-wider pl-1">
                      Quick Suggestions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_CHIPS.map((chip, index) => (
                        <button
                          key={index}
                          onClick={() => handleSend(chip)}
                          className="px-3 py-1.5 bg-surface-2 hover:bg-primary/20 hover:border-primary/50 border border-border rounded-lg text-xs text-text font-medium transition-all shadow-xs text-left active:scale-95"
                          style={{ minHeight: 36 }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Message History */}
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-start gap-2 max-w-[85%]">
                      {!isUser && (
                        <div className="w-6 h-6 rounded-lg bg-surface-2 border border-border text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Sparkles size={12} />
                        </div>
                      )}

                      <div
                        className={`rounded-xl px-3.5 py-2.5 shadow-xs ${
                          isUser
                            ? 'bg-primary text-white rounded-tr-xs font-medium'
                            : 'bg-surface-2 border border-border text-text rounded-tl-xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <MarkdownRenderer content={msg.text} />
                        )}
                      </div>
                    </div>

                    {/* Interactive Action Chips (Navigation / Switch mode) */}
                    {!isUser && msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-8 pt-1">
                        {msg.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action)}
                            className="px-3 py-1.5 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                            style={{ minHeight: 36 }}
                          >
                            <span>{action.label}</span>
                            <ArrowRight size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-lg bg-surface-2 border border-border text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles size={12} />
                  </div>
                  <div className="bg-surface-2 border border-border rounded-xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-primary/80 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}

              {/* Error Alert with Retry button */}
              {error && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl space-y-2 text-danger animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-medium">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={retryLast}
                      className="px-3 py-1 bg-danger hover:bg-danger/90 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      style={{ minHeight: 32 }}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box Area */}
            <div className="p-3 bg-surface border-t border-border shrink-0 space-y-1.5">
              <div className="flex items-end gap-2 bg-surface-2 border border-border rounded-xl p-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or request navigation..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 bg-transparent border-0 outline-none text-xs text-text placeholder:text-text-3 resize-none px-2 py-1.5 max-h-24 no-scrollbar disabled:opacity-50 font-sans"
                  style={{ minHeight: 36 }}
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-xs font-bold"
                  style={{ minWidth: 36, minHeight: 36 }}
                >
                  <Send size={15} />
                </button>
              </div>

              {/* Input Footer: char counter and shortcut hint */}
              <div className="flex items-center justify-between px-1 text-[10px] text-text-muted">
                <span>Enter to send · Shift+Enter for new line</span>
                <span className={input.length >= 480 ? 'text-warn font-semibold' : ''}>
                  {input.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
