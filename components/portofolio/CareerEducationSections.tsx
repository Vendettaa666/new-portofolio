"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import ExperienceAccordion from "@/components/portofolio/ExperienceAccordion";

export const educationData = [
  {
    degree: "Rekayasa Perangkat Lunak",
    school: "SMK Negeri 1 Lumajang",
    location: "Lumajang, Jawa Timur",
    startDate: "2023",
    endDate: "2026",
    logoIcon: "/assets/logo-smk.png", // Path gambar dari folder public
    details: "Mempelajari dasar-dasar pemrograman, pengembangan web, dan teknologi informasi."
  }
];
export const careers = [];


export function CareerSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
          <Briefcase className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Karier</h2>
      </div>
      
      <div className="flex flex-col gap-4">
        {careers.length === 0 ? (
          <div className="w-full rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-8 flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-neutral-800/30">
            <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Belum ada pengalaman kerja
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              Saat ini saya sedang fokus mengembangkan keahlian dan terbuka untuk peluang magang atau pekerjaan pertama saya!
            </p>
          </div>
        ) : (
          careers.map((career, index) => (
            <ExperienceAccordion key={`career-${index}`} item={career} index={index} />
          ))
        )}
      </div>
    </motion.div>
  );
}

export function EducationSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
          <GraduationCap className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Pendidikan</h2>
      </div>
      
      <div className="flex flex-col gap-4">
        {educationData.map((edu, index) => (
          <ExperienceAccordion key={`edu-${index}`} item={edu} index={index} />
        ))}
      </div>
    </motion.div>
  );
}