"use client";

import { motion } from "framer-motion";
import HeroCard from "@/components/portofolio/HeroCard";
import QuickStats from "@/components/portofolio/QuickStats"; // Import komponen baru
import ToolStack from "@/components/portofolio/ToolsStack";

export default function Home() {
  return (
    <div className="min-h-screen max-w-9xl space-y-8 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroCard />
      </motion.div>

      <QuickStats />

      {/* Tech Stack Section */}
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