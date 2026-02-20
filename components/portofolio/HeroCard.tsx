// components/portofolio/HeroCard.tsx
"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  Terminal,
  Cpu,
  Code2,
  Settings2,
  Users,
} from "lucide-react";
import HeaderStatus from "@/components/ui/HeaderStatus";

const projectCards = [
  {
    icon: <Code2 className="h-5 w-5 text-blue-400" />,
    iconBg: "bg-blue-500/10",
    title: "AI-Powered Web Apps",
    desc: "Integrating LLMs into frontend workflows.",
    badge: "ACTIVE",
    badgeClass: "text-green-400 border-green-500/20 bg-green-500/10",
  },
  {
    icon: <Settings2 className="h-5 w-5 text-green-400" />,
    iconBg: "bg-green-500/10",
    title: "Automation Systems",
    desc: "Connecting APIs and background tasks.",
    badge: "ACTIVE",
    badgeClass: "text-green-400 border-green-500/20 bg-green-500/10",
  },
  {
    icon: <Users className="h-5 w-5 text-purple-400" />,
    iconBg: "bg-purple-500/10",
    title: "Collaboration",
    desc: "Open to technical partnership roles.",
    badge: "ACTIVE",
    badgeClass: "text-green-400 border-green-500/20 bg-green-500/10",
  },
];

export default function HeroCard() {
  return (
    // HAPUS md:grid-cols-2 di sini agar tablet tetap 1 kolom
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
      
      {/* Kolom Kiri: Header Status & Hero Card utama */}
      <div className="lg:col-span-3 flex flex-col h-full gap-4 md:gap-6">
        <HeaderStatus />
        
        <div className="relative flex-1 overflow-hidden rounded-3xl shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative flex flex-col gap-6 p-7 h-full md:flex-row md:items-center md:p-10">
            {/* Text Content */}
            <div className="flex flex-1 flex-col gap-5">
              {/* Status Badge */}
              <div className="w-fit flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-500 shadow-[0_0_10px_rgba(16,185,129,0.2),inset_0_0_3px_rgba(16,185,129,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                STATUS : ONLINE
              </div>

              {/* Heading */}
              <div>
                <p className="text-sm font-medium mb-1 transition-colors duration-200 text-neutral-500 dark:text-neutral-400">
                  Halo, saya
                </p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl transition-colors duration-200 text-neutral-900 dark:text-white">
                  Leo Satria Anugrah
                </h1>
              </div>

              {/* Description */}
              <p className="max-w-md text-sm leading-relaxed transition-colors duration-200 text-neutral-600 dark:text-neutral-400">
                🚀 Pengembang otodidak yang antusias dengan Laravel, Flutter, dan teknologi baru. 🎸 Musik memicu kreativitas saya, terutama genre gelap & atmosferik seperti NU metal & DSBM. ☕ Saya paling produktif ditemani es kopi dan musik keras saat coding. 🤝 Selalu terbuka untuk kolaborasi, belajar, dan menghadapi tantangan baru!
              </p>

              {/* Location & Work Type */}
              <div className="flex flex-wrap items-center gap-4 text-xs transition-colors duration-200 text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  Lumajang One Pride
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  Onsite / Remote
                </span>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-lg active:scale-95 transition-all duration-200 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200">
                  Lihat Proyek
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold active:scale-95 transition-all duration-200 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700/80">
                  <MessageCircle className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  Ruang Obrolan
                </button>
              </div>
            </div>

            {/* Terminal Visual */}
            <div className="relative hidden h-64 w-64 shrink-0 md:block lg:h-72 lg:w-72">
              <div className="absolute inset-0 rounded-3xl bg-blue-500/5 border border-blue-500/10" />
              <motion.div animate={{ 
                  y: [0, -3, 0], // Bergerak ke atas 10px lalu kembali
                  rotate: [0, 3, 0] // Rotasi sedikit agar lebih natural
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-4 flex items-center justify-center">
                <div className="w-full rounded-2xl p-5 shadow-2xl transition-all duration-200 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a]">
                  <div className="mb-4 flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>~/ vendettaa.dev</span>
                    </div>
                    <div className="mt-1 text-neutral-500">
                      <span className="text-green-400">{">"}</span> building amazing things...
                    </div>
                    <div className="flex gap-2 mt-2 transition-colors duration-200 text-neutral-600 dark:text-neutral-400">
                      <span className="text-purple-400">const</span>
                      <span className="text-neutral-900 dark:text-white">passion</span>
                      <span className="text-pink-400">=</span>
                      <span className="text-yellow-500 dark:text-yellow-300">{"'code'"}</span>
                      <span className="text-neutral-400 dark:text-neutral-500">;</span>
                    </div>
                  </div>
                </div>
              </motion.div>

             {/* Floating icons */}
              <motion.div 
                animate={{ 
                  y: [0, -10, 0], // Bergerak ke atas 10px lalu kembali
                  rotate: [0, 5, 0] // Rotasi sedikit agar lebih natural
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>

              <motion.div 
                animate={{ 
                  y: [0, 10, 0], // Bergerak ke bawah 10px lalu kembali (berlawanan dengan icon atas)
                  rotate: [0, -5, 0] 
                }}
                transition={{ 
                  duration: 5, // Durasinya dibedakan sedikit agar gerakannya tidak barengan
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -bottom-3 -left-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <Cpu className="h-5 w-5 text-blue-400" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Project Cards */}
      <div className="flex flex-col h-full gap-4 md:gap-6 lg:col-span-1">
        {projectCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
            className="flex flex-1 flex-col justify-center gap-3 rounded-3xl p-5 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 hover:shadow-md"
          >
            {/* Container Icon & Badge */}
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
                {card.icon}
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide transition-colors duration-200 ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>

            {/* Container Text */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-snug transition-colors duration-200 text-neutral-900 dark:text-white">
                {card.title}
              </h4>
              <p className="text-xs mt-1 leading-relaxed transition-colors duration-200 text-neutral-600 dark:text-neutral-400">
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}