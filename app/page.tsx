"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Twitter, MapPin } from "lucide-react";
import Link from "next/link";

// Komponen Card Wrapper (Glassmorphism)
const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 overflow-hidden relative hover:border-neutral-700 transition-colors ${className}`}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <div className="space-y-6"> {/* Kurangi gap karena sudah ada navbar */}

      {/* Hapus Header lama, ganti dengan Greeting simple atau langsung Grid */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Overview</h2>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">

        {/* 1. Bio Utama (Large) */}
        <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-between group">
          <div>
            <div className="flex justify-between items-start">
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full border border-green-500/20">
                AVAILABLE FOR WORK
              </span>
              <ArrowUpRight className="text-neutral-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-4xl font-bold mt-4 leading-tight">
              I build <span className="text-blue-500">accessible</span> pixels & digital experiences.
            </h3>
          </div>
          <p className="text-neutral-400 text-sm mt-4">
            Halo! Saya Developer yang fokus pada React, Next.js, dan UI Design. Mengubah ide kompleks menjadi interface yang simpel.
          </p>
        </BentoCard>

        {/* 2. Project Highlight (Image Background) */}
        <BentoCard className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2 relative group p-0" delay={0.1}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          {/* Ganti dengan gambar project Anda */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute bottom-6 left-6 z-20">
            <h4 className="font-bold text-white text-lg">E-Commerce App</h4>
            <p className="text-neutral-300 text-xs">Next.js + Stripe</p>
          </div>
        </BentoCard>

        {/* 3. Tech Stack (Marquee Style) */}
        <BentoCard className="col-span-1 md:col-span-1 row-span-1 flex flex-col justify-center items-center gap-4" delay={0.2}>
          <h4 className="text-neutral-500 text-xs font-bold tracking-widest uppercase">Tech Stack</h4>
          <div className="flex gap-4 text-neutral-300">
            <span className="font-mono text-xl font-bold">React</span>
            <span className="font-mono text-xl font-bold">TS</span>
            <span className="font-mono text-xl font-bold">Next</span>
          </div>
        </BentoCard>

        {/* 4. Map / Location */}
        <BentoCard className="col-span-1 row-span-1 flex flex-col justify-center items-center bg-blue-600 border-none" delay={0.3}>
          <MapPin className="text-white mb-2" size={32} />
          <h4 className="text-white font-bold text-lg">Jakarta, ID</h4>
          <p className="text-blue-200 text-xs">WIB (GMT+7)</p>
        </BentoCard>

        {/* 5. Social Links (Small Grid inside) */}
        <BentoCard className="col-span-1 row-span-1 p-4" delay={0.4}>
          <div className="h-full flex flex-col justify-between">
            <h4 className="text-neutral-400 text-sm font-medium">Connect</h4>
            <div className="flex gap-3 mt-2">
              <Link href="#" className="p-3 bg-neutral-800 rounded-full hover:bg-white hover:text-black transition-colors"><Github size={20} /></Link>
              <Link href="#" className="p-3 bg-neutral-800 rounded-full hover:bg-[#0077b5] hover:text-white transition-colors"><Linkedin size={20} /></Link>
              <Link href="#" className="p-3 bg-neutral-800 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-colors"><Twitter size={20} /></Link>
            </div>
          </div>
        </BentoCard>

        {/* 6. Stats / Numbers */}
        <BentoCard className="col-span-1 md:col-span-2 row-span-1 flex items-center justify-around" delay={0.5}>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white">3+</h3>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Years Exp</p>
          </div>
          <div className="w-px h-10 bg-neutral-800" />
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white">20+</h3>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Projects</p>
          </div>
          <div className="w-px h-10 bg-neutral-800" />
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white">100%</h3>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Satisfaction</p>
          </div>
        </BentoCard>

      </div>
    </div>
  );
}