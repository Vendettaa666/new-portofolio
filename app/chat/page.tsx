"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChatRoom from "@/components/portofolio/ChatRoom";
import { MessageCircle, Users, TrendingUp } from "lucide-react";

export default function ChatPage() {
  const [messageCount, setMessageCount] = useState(0);

  return (
    <div className="min-h-screen w-full transition-colors duration-200">
      <main className="w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col min-h-screen">

        {/* Header Ruang Obrolan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 space-y-4 flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 shadow-lg">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
                Ruang Obrolan
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Real-time messaging
              </p>
            </div>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Jangan ragu untuk berbagi pemikiran, saran, pertanyaan, atau apa pun! Semua pesan akan ditampilkan secara real-time dan tersimpan di database.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Messages */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800/50 dark:to-neutral-800/30 border-2 border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <MessageCircle size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Total Pesan</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  {messageCount}
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Komponen Utama Chat - Takes remaining height */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1 w-full"
          style={{ minHeight: "500px", height: "calc(100vh - 320px)" }}
        >
          <ChatRoom onMessageCountChange={setMessageCount} />
        </motion.section>

      </main>
    </div>
  );
}