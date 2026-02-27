"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble from "@/components/ui/ChatBubble";
import ChatInput from "@/components/ui/ChatInput";
import { supabase } from "@/lib/supabase";
import { FaGithub } from "react-icons/fa";
import { LogOut, Loader2 } from "lucide-react";

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
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Check current session
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check:', { session, error });
        
        if (session?.user) {
          console.log('User logged in:', session.user.email);
          setUser(session.user);
        } else {
          console.log('No active session');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user || null);
    });

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
            time: new Date(msg.created_at).toLocaleString('id-ID', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            message: msg.content,
            created_at: msg.created_at
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
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
            time: new Date(newMsg.created_at).toLocaleString('id-ID', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            message: newMsg.content,
            created_at: newMsg.created_at
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
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Send message
  const handleNewMessage = async (text: string) => {
    if (!user || !text.trim()) return;

    try {
      const displayName = user.user_metadata?.full_name || 
                         user.user_metadata?.user_name || 
                         user.email?.split('@')[0] || 
                         'Anonymous';
      const avatarUrl = user.user_metadata?.avatar_url || 
                       `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

      const { error } = await supabase.from("messages").insert([{
        username: displayName,
        avatar_url: avatarUrl,
        content: text,
        user_id: user.id
      }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow-xl overflow-hidden">
        <div className="flex items-center justify-center h-[600px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Memuat chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow-xl overflow-hidden backdrop-blur-sm">
      
      {/* Header with user info */}
      {user && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 py-4 px-6 flex justify-between items-center border-b-2 border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white dark:border-neutral-600 shadow-md">
                <img 
                  src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-neutral-800 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">
                {user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Sedang Online
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all border border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      )}

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 p-6 min-h-[500px] max-h-[600px] bg-gradient-to-b from-neutral-50/50 to-white dark:from-neutral-900/30 dark:to-neutral-800/50 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400 dark:hover:scrollbar-thumb-neutral-600"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20 dark:border-primary/30">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Belum ada pesan
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
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
        <ChatInput onSendMessage={handleNewMessage} />
      ) : (
        <div className="p-8 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-900/50 dark:via-neutral-800/50 dark:to-neutral-900/50 border-t-2 border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center gap-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center border-2 border-primary/20 dark:border-primary/30">
              <FaGithub className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
              Login untuk bergabung
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Masuk dengan akun GitHub Anda untuk mulai mengirim pesan dan bergabung dalam percakapan real-time
            </p>
          </div>
          <button 
            onClick={handleLogin}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-100 text-white dark:text-neutral-900 font-bold rounded-xl hover:opacity-90 transition-all shadow-xl hover:shadow-2xl active:scale-95 border-2 border-neutral-800 dark:border-neutral-200"
          >
            <FaGithub size={22} />
            Login dengan GitHub
          </button>
        </div>
      )}
    </div>
  );
}
