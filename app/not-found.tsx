"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      
      {/* 1. Animated Icon Wrapper */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Background Blur/Glow */}
        <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full" />
        
        <div className="relative w-32 h-32 bg-neutral-900/50 border border-neutral-800 rounded-3xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
           <AlertTriangle size={48} className="text-yellow-500" />
        </div>
        
        {/* Decorator Dots */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500 rounded-full" />
      </motion.div>

      {/* 2. Text Content */}
      <div className="space-y-2">
        <h1 className="text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="text-neutral-400 max-w-md mx-auto">
          Oops! Sepertinya data yang kamu cari telah dipindahkan atau hilang dari dashboard ini.
        </p>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 rounded-xl border border-neutral-800 text-black dark:text-white hover:bg-neutral-800 hover:text-white transition flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition flex items-center gap-2 shadow-lg shadow-white/10"
        >
          <Home size={18} />
          Dashboard
        </Link>
      </div>

    </div>
  );
}