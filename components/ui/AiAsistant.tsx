"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, Sparkles, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role:    "user" | "assistant";
  content: string;
}

// ─── Suggested questions ──────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Apa keahlian utama Leo?",
  "Proyek apa yang sudah dibuat?",
  "Apakah Leo open to work?",
  "Bagaimana cara menghubungi Leo?",
];

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mb-0.5">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-primary text-white rounded-br-sm"
            : "bg-neutral-100 dark:bg-neutral-700/80 text-neutral-800 dark:text-neutral-100 rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AiAssistant() {
  const [mounted,  setMounted]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [message,  setMessage]  = useState("");
  const [chat,     setChat]     = useState<Message[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [hasNew,   setHasNew]   = useState(false);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  // Fix hydration: only render on client
  useEffect(() => { setMounted(true); }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasNew(false);
    }
  }, [open]);

  // Welcome message on first open
  useEffect(() => {
    if (open && chat.length === 0) {
      setChat([{
        role:    "assistant",
        content: "Halo! 👋 Saya Vinux, asisten AI Leo Satria Anugrah. Tanya apa saja tentang Leo — skill, proyek, pengalaman, atau cara menghubunginya!",
      }]);
    }
  }, [open]);

  async function sendMessage(text?: string) {
    const msg = (text ?? message).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    const newChat = [...chat, userMsg];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          message: msg,
          // Pass conversation history (exclude welcome message)
          history: newChat
            .filter((_, i) => i > 0)
            .map((m) => ({
              role:    m.role === "user" ? "user" : "assistant",
              content: m.content,
            })),
        }),
      });

      const data = await res.json();
      const aiMsg: Message = { role: "assistant", content: data.reply };
      setChat((prev) => [...prev, aiMsg]);
      if (!open) setHasNew(true);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, terjadi kesalahan. Coba lagi ya! 😅" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setChat([]);
    setTimeout(() => {
      setChat([{
        role:    "assistant",
        content: "Chat direset! Ada yang bisa saya bantu? 😊",
      }]);
    }, 100);
  }

  const showSuggestions = chat.length <= 1;

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Chat Panel ───────────────────────────────────────────────────── */}
      <div
        className={`flex flex-col overflow-hidden rounded-3xl shadow-2xl
          border border-neutral-200 dark:border-neutral-700
          bg-white dark:bg-neutral-900
          w-[340px] sm:w-[380px]
          transition-all duration-300 ease-out origin-bottom-right
          ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
        style={{ maxHeight: "520px" }}
      >
        {/* Primary accent line */}
        {/* <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-80 rounded-t-3xl" /> */}

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3.5
          border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
                Vinux Assistant
            </p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
                AI Assistant · Online
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {chat.length > 1 && (
              <button
                onClick={clearChat}
                title="Reset chat"
                className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500
                  hover:text-primary dark:hover:text-primary
                  px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800
                  transition-colors duration-150"
              >
                Reset
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg
                text-neutral-400 dark:text-neutral-500
                hover:text-neutral-700 dark:hover:text-neutral-300
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                transition-colors duration-150"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3
          scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700"
          style={{ minHeight: 200, maxHeight: 340 }}
        >
          {chat.map((msg, i) => (
            <Bubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-700/80 rounded-2xl rounded-bl-sm shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Suggestions ── */}
        {showSuggestions && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full
                  border border-primary/30 text-primary
                  bg-primary/5 hover:bg-primary/10
                  transition-colors duration-150"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── Input ── */}
        <div className="px-3 pb-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2 rounded-2xl
            border border-neutral-200 dark:border-neutral-700
            bg-neutral-50 dark:bg-neutral-800/60
            px-3 py-2 transition-all duration-150
            focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-neutral-800">
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Tanya sesuatu tentang Leo..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white
                placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                outline-none disabled:opacity-50 min-w-0"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!message.trim() || loading}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl
                bg-primary text-white shadow-sm
                hover:opacity-90 active:scale-95
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150"
            >
              {loading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Send className="h-3.5 w-3.5" />
              }
            </button>
          </div>
          {/* <p className="text-[9px] text-neutral-300 dark:text-neutral-600 text-center mt-1.5 font-medium">
            Powered by Llama 3 via OpenRouter
          </p> */}
        </div>
      </div>

      {/* ── FAB Button ───────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex h-13 w-13 items-center justify-center rounded-2xl shadow-xl
          transition-all duration-300 ease-out
          ${open
            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rotate-0 scale-95"
            : "bg-primary text-white hover:scale-105 active:scale-95"
          }`}
        style={{ height: 52, width: 52 }}
        aria-label="Open AI Assistant"
      >
        {/* Ping animation when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl animate-ping bg-primary opacity-20" />
        )}

        {open
          ? <X className="h-5 w-5" />
          : <Sparkles className="h-5 w-5" />
        }

        {/* New message indicator */}
        {hasNew && !open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-neutral-900" />
        )}
      </button>

    </div>
  );
}