"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble from "@/components/ui/ChatBubble";
import ChatInput from "@/components/ui/ChatInput";
import { supabase } from "@/lib/supabase";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LogOut, Loader2, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  avatar: string;
  name: string;
  time: string;
  message: string;
  created_at: string;
}

interface ChatRoomProps {
  onMessageCountChange?: (count: number) => void;
}

export default function ChatRoom({ onMessageCountChange }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update message count when messages change
  useEffect(() => {
    if (onMessageCountChange) {
      onMessageCountChange(messages.length);
    }
  }, [messages.length, onMessageCountChange]);

  // Check auth and fetch messages
  useEffect(() => {
    // Clean up URL hash after OAuth redirect
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    // Check current session
    const checkUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    // Fetch messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedMessages = data.map((msg) => ({
            id: msg.id,
            avatar: msg.avatar_url,
            name: msg.username,
            time: new Date(msg.created_at).toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            message: msg.content,
            created_at: msg.created_at,
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("realtime-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as any;
          const formattedMsg: Message = {
            id: newMsg.id,
            avatar: newMsg.avatar_url,
            name: newMsg.username,
            time: new Date(newMsg.created_at).toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            message: newMsg.content,
            created_at: newMsg.created_at,
          };
          setMessages((prev) => [...prev, formattedMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Login with GitHub
  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Send message
  const handleNewMessage = async (text: string) => {
    if (!user || !text.trim()) return;

    try {
      const displayName =
        user.user_metadata?.full_name ||
        user.user_metadata?.user_name ||
        user.email?.split("@")[0] ||
        "Anonymous";
      const avatarUrl =
        user.user_metadata?.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

      const { error } = await supabase.from("messages").insert([
        {
          username: displayName,
          avatar_url: avatarUrl,
          content: text,
          user_id: user.id,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow-xl overflow-hidden">
        <div className="flex items-center justify-center h-full py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Memuat chat...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow-xl overflow-hidden backdrop-blur-sm">

      {/* Header with user info */}
      {user && (
        <div className="flex-shrink-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 py-3 px-4 md:py-4 md:px-6 flex justify-between items-center border-b-2 border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden border-2 border-white dark:border-neutral-600 shadow-md">
                <img
                  src={
                    user.user_metadata?.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-neutral-800 rounded-full"></div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">
                {user.user_metadata?.full_name ||
                  user.user_metadata?.user_name ||
                  user.email?.split("@")[0]}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                <span className="hidden sm:inline">Sedang Online</span>
                <span className="sm:hidden">Online</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all border border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800 ml-2"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      )}

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 md:space-y-4 p-4 md:p-6 bg-gradient-to-b from-neutral-50/50 to-white dark:from-neutral-900/30 dark:to-neutral-800/50 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400 dark:hover:scrollbar-thumb-neutral-600"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20 dark:border-primary/30">
              <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Belum ada pesan
            </h3>
            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 max-w-xs md:max-w-sm">
              Jadilah yang pertama untuk memulai percakapan! Kirim pesan dan mulai diskusi.
            </p>
          </div>
        ) : (
          messages.map((chat) => (
            <ChatBubble
              key={chat.id}
              avatar={chat.avatar}
              name={chat.name}
              time={chat.time}
              message={chat.message}
            />
          ))
        )}
      </div>

      {/* Input area or login prompt */}
      {user ? (
        <div className="flex-shrink-0">
          <ChatInput onSendMessage={handleNewMessage} />
        </div>
      ) : (
        <div className="flex-shrink-0 p-6 md:p-8 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-900/50 dark:via-neutral-800/50 dark:to-neutral-900/50 border-t-2 border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center gap-5 md:gap-6">
          <div className="text-center max-w-md">
            
            <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Login untuk bergabung
            </h3>
            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Masuk dengan akun GitHub atau Google untuk mulai mengirim pesan dan bergabung dalam percakapan real-time
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full max-w-sm gap-3">
            <button
              onClick={handleLogin}
              className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95 text-sm"
            >
              <FaGithub size={20} />
              GitHub
            </button>
            <button
              onClick={handleGoogleLogin}
              className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white border-2 border-neutral-200 dark:border-neutral-700 font-bold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-lg active:scale-95 text-sm"
            >
              <FaGoogle size={20} className="text-red-500" />
              Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}