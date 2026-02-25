"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  avatar: string;
  name: string;
  time: string;
  message: string;
}

export default function ChatBubble({ avatar, name, time, message }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 group"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex-shrink-0 shadow-sm">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-[85%] md:max-w-[75%] flex-1">
        {/* Header: Nama & Waktu */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            {name}
          </span>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-500 font-medium">
            {time}
          </span>
        </div>

        {/* Bubble Chat */}
        <div className="bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-all duration-200">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {message} 
          </p>
        </div>
      </div>
    </motion.div>
  );
}