// app/page.tsx - Landing Page
"use client";

import { motion } from "framer-motion";
import HeroCard from "@/components/portofolio/HeroCard";
import ToolStack from "@/components/portofolio/ToolsStack";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ArrowRight, Briefcase, Code, Award } from "lucide-react";
import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen max-w-9xl space-y-8 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroCard />
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatCard
          icon={<Code className="w-5 h-5" />}
          title="Projects"
          value="9+"
          description="Completed projects"
          href="/projects"
        />
        <StatCard
          icon={<Briefcase className="w-5 h-5" />}
          title="Experience"
          value="2+ Years"
          description="Professional work"
          href="/about"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          title="Achievements"
          value="5+"
          description="Certifications"
          href="/achivement"
        />
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ToolStack />
      </motion.div>

     

    </div>
  );
}

// Stat Card Component
function StatCard({ 
  icon, 
  title, 
  value, 
  description, 
  href 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  description: string; 
  href: string;
}) {
  return (
    <Link href={href}>
      <SpotlightCard spotlightColor="color-mix(in srgb, var(--theme-primary) 30%, transparent)"
        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-neutral-800/50 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg hover:shadow-xl hover:border-primary dark:hover:border-primary transition-all cursor-pointer"
      >
      {/* <div className="group p-6 bg-white dark:bg-neutral-800/50 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg hover:shadow-xl hover:border-primary dark:hover:border-primary transition-all cursor-pointer"> */}
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
      {/* </div> */}
      </SpotlightCard>
    </Link>
  );
}
