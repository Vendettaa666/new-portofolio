"use client";

import { useState } from "react";
import { Send, Smile } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <div className="sticky bottom-0 bg-neutral-100 dark:bg-neutral-900 py-4 border-t border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2 focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Tulis pesan..."
          className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-white text-sm py-2 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        />

        <button 
          onClick={handleSend}
          disabled={!text.trim()}
          className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${
            text.trim() 
            ? "bg-primary text-white hover:bg-primary/90 active:scale-95 shadow-md" 
            : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
          }`}
        >
          <Send size={16} />
        </button>
        
      </div>
    </div>
  );
}