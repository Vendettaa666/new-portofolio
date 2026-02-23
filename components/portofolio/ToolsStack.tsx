// components/portofolio/ToolStack.tsx
"use client";

import React from "react";

import { motion } from "framer-motion";
// Sesuaikan path ini dengan lokasi file GlassIcons kamu
import GlassIcons from "@/components/ui/GlassIcons";
import {
  SiHtml5,
  SiCss3,
  SiBootstrap,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiVite,
  SiNextdotjs,
  SiPrisma,
  SiRedux,
  SiSupabase,
  SiNodedotjs,
  SiPhp,
  SiLaravel,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiNpm,
  SiGithub,
  SiComposer,
  SiAlpinedotjs,
  SiInertia,
  SiCanva,
  SiFigma,
  SiDart,
  SiFlutter,
  SiLivewire,
  SiPostman,
  SiLaragon,
  SiFilament,
  
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

export default function ToolStack() {
  const tools = [
    {
      icon: <VscCode className="w-full h-full" />,
      color: "#007ACC",
      label: "VS Code",
    },
    {
      icon: <SiReact className="w-full h-full" />,
      color: "#61DAFB",
      label: "React.js",
    },
    {
      icon: <SiNextdotjs className="w-full h-full" />,
      color: "#000000",
      label: "Next.js",
    },
    {
      icon: <SiTailwindcss className="w-full h-full" />,
      color: "#06B6D4",
      label: "Tailwind CSS",
    },
    {
      icon: <SiBootstrap className="w-full h-full" />,
      color: "#7952B3",
      label: "Bootstrap",
    },
    {
      icon: <SiJavascript className="w-full h-full" />,
      color: "#F7DF1E",
      label: "JavaScript",
    },
    {
      icon: <SiNodedotjs className="w-full h-full" />,
      color: "#339933",
      label: "Node.js",
    },
    {
      icon: <SiGithub className="w-full h-full" />,
      color: "#181717",
      label: "GitHub",
    },
    {
      icon: <SiInertia className="w-full h-full" />,
      color: "#9553E9",
      label: "Inertia.js",
    },
    {
      icon: <SiCanva className="w-full h-full" />,
      color: "#00C4CC",
      label: "Canva",
    },
    {
      icon: <SiFigma className="w-full h-full" />,
      color: "#F24E1E",
      label: "Figma",
    },
    {
      icon: <SiMysql className="w-full h-full" />,
      color: "#4479A1",
      label: "MySQL",
    },
    {
      icon: <SiDart className="w-full h-full" />,
      color: "#0175C2",
      label: "Dart",
    },
    {
      icon: <SiLaravel className="w-full h-full" />,
      color: "#FF2D20",
      label: "Laravel",
    },
    {
      icon: <SiFlutter className="w-full h-full" />,
      color: "#02569B",
      label: "Flutter",
    },
    {
      icon: <SiAlpinedotjs className="w-full h-full" />,
      color: "#8BC0D0",
      label: "Alpine.js",
    },
    {
      icon: <SiPhp className="w-full h-full" />,
      color: "#777BB4",
      label: "PHP",
    },
    {
      icon: <SiLivewire className="w-full h-full" />,
      color: "#4E56A6",
      label: "Livewire",
    },
    {
      icon: <SiPostman className="w-full h-full" />,
      color: "#FF6C37",
      label: "Postman",
    },
    {
      icon: <SiVite className="w-full h-full" />,
      color: "#646CFF",
      label: "Vite",
    },
    {
      icon: <SiTypescript className="w-full h-full" />,
      color: "#3178C6",
      label: "TypeScript",
    },
    {
      icon: <SiComposer className="w-full h-full" />,
      color: "#885630",
      label: "Composer",
    },
    {
      icon: <SiNpm className="w-full h-full" />,
      color: "#CB3837",
      label: "NPM",
    },
    {
      icon: <SiHtml5 className="w-full h-full" />,
      color: "#E34F26",
      label: "HTML5",
    },
    {
      icon: <SiCss3 className="w-full h-full" />,
      color: "#1572B6",
      label: "CSS3",
    },
    {
      icon: <SiPrisma className="w-full h-full" />,
      color: "#2D3748",
      label: "Prisma",
    },
    {
      icon: <SiRedux className="w-full h-full" />,
      color: "#764ABC",
      label: "Redux",
    },
    {
      icon: <SiSupabase className="w-full h-full" />,
      color: "#3ECF8E",
      label: "Supabase",
    },
    {
      icon: <SiPostgresql className="w-full h-full" />,
      color: "#336791",
      label: "PostgreSQL",
    },
    {
      icon: <SiDocker className="w-full h-full" />,
      color: "#2496ED",
      label: "Docker",
    },
    {
      icon: <SiLaragon className="w-full h-full" />,
      color: "#2496ED",
      label: "Laragon",
    },
    {
      icon: <SiFilament className="w-full h-full" />,
      color: "#2496ED",
      label: "Filament",
    },

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
        {/* Berikan className string kosong agar TypeScript bahagia */}
        <GlassIcons items={tools} className="" />
      </div>
    </motion.div>
  );
}
