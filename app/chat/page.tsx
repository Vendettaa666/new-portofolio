"use client";

import { motion } from "framer-motion";
import ChatRoom from "@/components/portofolio/ChatRoom";
import { MessageCircle, Users } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="min-h-screen max-w-9xl transition-colors duration-200">
      <main className="max-w-9xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* Header Ruang Obrolan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
                Ruang Obrolan
              </h1>
            </div>
          </div>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Jangan ragu untuk berbagi pemikiran, saran, pertanyaan, atau apa pun! Semua pesan akan ditampilkan secara real-time.
          </p>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">3 Pesan</span>
            </div>
            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">Online</span>
            </div>
          </div>
        </motion.div>

        {/* Komponen Utama Chat */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <ChatRoom />
        </motion.section>

      </main>
    </div>
  );
}