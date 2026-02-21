"use client";

import { motion } from "framer-motion";
import BioSection from "@/components/portofolio/BioSection";
import SkillsSection from "@/components/portofolio/SkillsSection";
import { CareerSection, EducationSection } from "@/components/portofolio/CareerEducationSections";

export default function AboutPage() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto flex flex-col gap-8 md:gap-12 p-4 md:p-6 lg:p-8 lg:py-12 transition-colors duration-200">
      
      {/* Header Halaman */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl transition-colors duration-200 text-neutral-900 dark:text-white mb-2">
          Tentang & Pengalaman
        </h1>
        <p className="text-sm transition-colors duration-200 text-neutral-600 dark:text-neutral-400">
          Kenali lebih jauh tentang latar belakang, perjalanan karier, dan keahlian saya.
        </p>
      </motion.div>

      {/* Komponen-komponen yang sudah dipisah */}
      <BioSection />
      <SkillsSection />
      <CareerSection />
      <EducationSection />

    </div>
  );
}