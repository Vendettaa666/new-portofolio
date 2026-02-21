// components/portofolio/ToolStack.tsx
"use client";

import React from "react";

import { motion } from "framer-motion";
// Sesuaikan path ini dengan lokasi file GlassIcons kamu
import GlassIcons from "@/components/ui/GlassIcons"; 
import { 
  SiHtml5, SiCss3, SiBootstrap, SiTailwindcss, SiJavascript, 
  SiTypescript, SiReact, SiVite, SiNextdotjs, SiPrisma, 
  SiRedux, SiSupabase, SiNodedotjs, SiPhp, SiLaravel, 
  SiPostgresql, SiMysql, SiDocker, SiNpm, SiGithub
} from "react-icons/si";

export default function ToolStack() {
  const tools = [
    { icon: <SiHtml5 className="w-full h-full" />, color: "#E34F26", label: "HTML5" },
    { icon: <SiCss3 className="w-full h-full" />, color: "#1572B6", label: "CSS3" },
    { icon: <SiBootstrap className="w-full h-full" />, color: "#7952B3", label: "Bootstrap" },
    { icon: <SiTailwindcss className="w-full h-full" />, color: "#06B6D4", label: "Tailwind" },
    { icon: <SiJavascript className="w-full h-full" />, color: "#F7DF1E", label: "JavaScript" },
    { icon: <SiTypescript className="w-full h-full" />, color: "#3178C6", label: "TypeScript" },
    { icon: <SiReact className="w-full h-full" />, color: "#61DAFB", label: "React" },
    { icon: <SiVite className="w-full h-full" />, color: "#646CFF", label: "Vite" },
    { icon: <SiNextdotjs className="w-full h-full" />, color: "#000000", label: "Next.js" },
    { icon: <SiPrisma className="w-full h-full" />, color: "#2D3748", label: "Prisma" },
    { icon: <SiRedux className="w-full h-full" />, color: "#764ABC", label: "Redux" },
    { icon: <SiSupabase className="w-full h-full" />, color: "#3ECF8E", label: "Supabase" },
    { icon: <SiNodedotjs className="w-full h-full" />, color: "#339933", label: "Node.js" },
    { icon: <SiPhp className="w-full h-full" />, color: "#777BB4", label: "PHP" },
    { icon: <SiLaravel className="w-full h-full" />, color: "#FF2D20", label: "Laravel" },
    { icon: <SiPostgresql className="w-full h-full" />, color: "#336791", label: "PostgreSQL" },
    { icon: <SiMysql className="w-full h-full" />, color: "#4479A1", label: "MySQL" },
    { icon: <SiDocker className="w-full h-full" />, color: "#2496ED", label: "Docker" },
    { icon: <SiNpm className="w-full h-full" />, color: "#CB3837", label: "NPM" },
    { icon: <SiGithub className="w-full h-full" />, color: "#181717", label: "GitHub" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
    >
      <div className="mb-2 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Tech Stack
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Teknologi yang saya gunakan untuk membangun aplikasi.
        </p>
      </div>

      <div className="w-full mt-8">
        <GlassIcons items={tools} />
      </div>
    </motion.div>
  );
}