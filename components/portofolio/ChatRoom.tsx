"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble from "@/components/ui/ChatBubble"; // Sesuaikan path jika berbeda
import ChatInput from "@/components/ui/ChatInput";   // Sesuaikan path jika berbeda
import { supabase } from "@/lib/supabase"; // Import client supabase
import { Github } from "lucide-react"; // Icon untuk tombol login

// Tipe data untuk state pesan kita
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
  const [user, setUser] = useState<any>(null); // State untuk user aktif
  const scrollRef = useRef<HTMLDivElement>(null);

  // Efek untuk Cek Auth & Fetch Pesan Realtime
  useEffect(() => {
    // 1. Cek User yang sedang Login
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // 2. Dengarkan perubahan status login
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // 3. Ambil Pesan Lama dari Supabase
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          avatar: msg.avatar_url,
          name: msg.username,
          time: new Date(msg.created_at).toLocaleString('id-ID', { 
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }),
          message: msg.content,
          created_at: msg.created_at
        }));
        setMessages(formattedMessages);
      }
    };
    fetchMessages();

    // 4. Listen pesan baru secara Real-time
    const channel = supabase.channel("realtime-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const newMsg = payload.new;
        const formattedMsg = {
          id: newMsg.id,
          avatar: newMsg.avatar_url,
          name: newMsg.username,
          time: new Date(newMsg.created_at).toLocaleString('id-ID', { 
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }),
          message: newMsg.content,
          created_at: newMsg.created_at
        };
        setMessages((prev) => [...prev, formattedMsg]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Otomatis scroll ke bawah
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fungsi Login & Logout GitHub
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Fungsi kirim pesan ke Supabase
  const handleNewMessage = async (text: string) => {
    if (!user || !text.trim()) return;

    // Ambil nama dan avatar dari akun GitHub user
    const displayName = user.user_metadata?.full_name || user.user_metadata?.user_name || user.email;
    const avatarUrl = user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

    // Insert ke tabel messages Supabase
    await supabase.from("messages").insert([{
      username: displayName,
      avatar_url: avatarUrl,
      content: text
    }]);
  };

  return (
    <div className="flex flex-col max-w-9xl rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow-lg overflow-hidden">
      
      {/* Header Kecil: Status Login & Tombol Logout */}
      {user && (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 py-2 px-6 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Masuk sebagai <strong className="text-neutral-900 dark:text-white">{user.user_metadata?.user_name || user.email}</strong>
          </span>
          <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">
            Logout
          </button>
        </div>
      )}

      {/* Area Daftar Pesan */}
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
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Belum ada pesan</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">Jadilah yang pertama untuk memulai percakapan!</p>
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

      {/* Area Input / Login Prompt */}
      {user ? (
        <ChatInput onSendMessage={handleNewMessage} />
      ) : (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
            Login untuk ikut bergabung dalam obrolan
          </p>
          <button 
            onClick={handleLogin}
            className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <Github size={18} />
            Login dengan GitHub
          </button>
        </div>
      )}
    </div>
  );
}