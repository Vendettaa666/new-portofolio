"use client";

import { motion } from "framer-motion";

export default function BioSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
    >
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      
      <div className="relative">
        <h2 className="text-xl font-bold mb-1 text-neutral-900 dark:text-white">
          Pengenalan Singkat
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
          Mengenai siapa saya.
        </p>
        <hr className="mb-6 border-t border-dashed border-neutral-300 dark:border-neutral-700" />
        <div className="space-y-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>
            Saya Leo Satria Anugrah, seorang Software Engineer yang berdedikasi untuk membangun solusi digital yang berdampak. 
            Saya spesialis dalam pengembangan platform web dan aplikasi menggunakan tech stack modern, termasuk Next.js, TypeScript, dan ekosistem React.
          </p>
          <p>
            Fokus utama saya adalah merancang arsitektur perangkat lunak yang tidak hanya berfungsi tetapi juga terstruktur dengan baik, 
            mudah dipelihara, dan skalabel untuk memenuhi kebutuhan bisnis.
          </p>
        </div>
        <div className="mt-8">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Salam hangat,</p>
          <h3 className="text-3xl font-bold tracking-tighter text-yellow-500 dark:text-yellow-400 font-serif italic">
            leo satria
          </h3>
        </div>
      </div>
    </motion.div>
  );
}