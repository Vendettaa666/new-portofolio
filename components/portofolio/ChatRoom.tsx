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

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check auth and fetch messages
  useEffect(() => {
    // Clean up URL hash after OAuth redirect
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Check current session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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
      <div className="flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow-lg overflow-hidden">
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow-lg overflow-hidden">
      
      {/* Header with user info */}
      {user && (
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 py-3 px-6 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-600">
              <img 
                src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {user.user_metadata?.user_name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Online</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 p-6 min-h-[500px] max-h-[600px] scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Belum ada pesan
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
              Jadilah yang pertama untuk memulai percakapan!
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
        <div className="p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900/50 dark:to-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Login untuk bergabung
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
              Masuk dengan akun GitHub Anda untuk mulai mengirim pesan dan bergabung dalam percakapan
            </p>
          </div>
          <button 
            onClick={handleLogin}
            className="flex items-center gap-3 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <FaGithub size={20} />
            Login dengan GitHub
          </button>
        </div>
      )}
    </div>
  );
}
