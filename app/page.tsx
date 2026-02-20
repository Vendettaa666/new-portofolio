"use client";

import HeroCard from "@/components/portofolio/HeroCard"; // Sesuaikan path jika berbeda
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, MapPin, Code2, Settings2, Users } from "lucide-react";
import Link from "next/link";

// Dark theme Bento Card - Clean Edition
const BentoCard = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 transition-all duration-300 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

// Project card data (Warna disesuaikan agar tidak norak)
const projectCards = [
  {
    icon: <Code2 className="h-5 w-5 text-blue-400" />,
    iconBg: "bg-blue-500/10",
    title: "AI-Powered Web Apps",
    desc: "Integrating LLMs into frontend workflows.",
    badge: "ACTIVE",
    badgeClass: "text-blue-400 border-blue-500/20 bg-blue-500/10",
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
    badge: "AVAILABLE",
    badgeClass: "text-neutral-400 border-neutral-700 bg-neutral-800",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] space-y-6 p-4 md:p-6 lg:p-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {/* ── ROW 1 ── */}

        {/* 1. Hero Card — spans 3 cols */}
        <div className="lg:col-span-3">
          <div className="mb-2 px-2">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">Overview</h2>
          </div>
          <HeroCard />
        </div>

        {/* 2. Project Cards Column — 1 col, spans 3 rows */}
        <div className="flex flex-col gap-4 lg:row-span-3">
          {projectCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
              className="flex items-start gap-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-5 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
                {card.icon}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug">{card.title}</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">{card.desc}</p>
              </div>
              {/* Badge */}
              <span className={`shrink-0 self-start rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${card.badgeClass}`}>
                {card.badge}
              </span>
            </motion.div>
          ))}
        </div>



      </div>
    </div>
  );
}