"use client";

import { motion } from "framer-motion";
import { Briefcase, Code, Award } from "lucide-react";
import Link from "next/link";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { listProyek, listSertifikat } from "@/lib/data";

export default function QuickStats() {
  // Hitung data secara otomatis dari data source
  const totalProjects = listProyek.length;
  const totalAchievements = listSertifikat.length;

  // Kamu bisa mengatur tahun mulai kerja di sini
  const startYear = 2024; 
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - startYear;

  const stats = [
    {
      icon: <Code className="w-5 h-5" />,
      title: "Projects",
      value: `${totalProjects}`,
      description: "Completed projects",
      href: "/projects",
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Experience",
      value: `${experienceYears}+ Years`,
      description: "Professional work",
      href: "/about",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Achievements",
      value: `${totalAchievements}`,
      description: "Certifications",
      href: "/achivement",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </motion.div>
  );
}

// Sub-component StatCard (Internal agar page.tsx tetap bersih)
function StatCard({ 
  icon, title, value, description, href 
}: { 
  icon: React.ReactNode; title: string; value: string; description: string; href: string;
}) {
  return (
    <Link href={href} className="block h-full">
      <SpotlightCard 
        spotlightColor="color-mix(in srgb, var(--theme-primary) 30%, transparent)"
        className="flex flex-col items-center justify-center p-6 h-full bg-white dark:bg-neutral-800/50 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg hover:shadow-xl hover:border-primary dark:hover:border-primary transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            {icon}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
        </div>
        <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
          {value}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      </SpotlightCard>
    </Link>
  );
}