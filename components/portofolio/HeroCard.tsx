"use client";

import { ArrowRight, MessageCircle, Sparkles, Terminal, Cpu } from "lucide-react";

export default function HeroCard() {
  return (
    <div className="relative col-span-full overflow-hidden rounded-3xl shadow-sm lg:col-span-3 transition-all duration-200
      border border-neutral-200 dark:border-neutral-800
      bg-neutral-50 dark:bg-neutral-900/40">

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex flex-col gap-6 p-7 md:flex-row md:items-center md:p-10">

        {/* Text Content */}
        <div className="flex flex-1 flex-col gap-5">

          {/* Status Badge */}
          <div className="w-fit flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-500">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            STATUS : ONLINE
          </div>

          {/* Heading */}
          <div>
            <p className="text-sm font-medium mb-1 transition-colors duration-200
              text-neutral-500 dark:text-neutral-400">
              Halo, saya
            </p>
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl transition-colors duration-200
              text-neutral-900 dark:text-white">
              Ajie
            </h1>
          </div>

          {/* Description */}
          <p className="max-w-md text-sm leading-relaxed md:text-base transition-colors duration-200
            text-neutral-600 dark:text-neutral-400">
            Seorang Software Engineer dan kreator konten coding yang berdedikasi
            untuk membangun solusi digital yang berdampak. Spesialis dalam
            pengembangan platform web yang skalabel menggunakan tech stack modern.
          </p>

          {/* Location & Work Type */}
          <div className="flex flex-wrap items-center gap-4 text-xs transition-colors duration-200
            text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
              Berdomisili di Kudus, Indonesia
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
              Onsite / Remote
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-lg active:scale-95 transition-all duration-200
              bg-neutral-900 dark:bg-white
              text-white dark:text-black
              hover:bg-neutral-800 dark:hover:bg-neutral-200">
              Lihat Proyek
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold active:scale-95 transition-all duration-200
              border border-neutral-300 dark:border-neutral-700
              bg-neutral-100 dark:bg-neutral-800
              text-neutral-900 dark:text-white
              hover:bg-neutral-200 dark:hover:bg-neutral-700/80">
              <MessageCircle className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              Ruang Obrolan
            </button>
          </div>
        </div>

        {/* Terminal Visual */}
        <div className="relative hidden h-64 w-64 shrink-0 md:block lg:h-72 lg:w-72">
          {/* Background blob */}
          <div className="absolute inset-0 rounded-3xl bg-blue-500/5 border border-blue-500/10" />

          <div className="absolute inset-4 flex items-center justify-center">
            <div className="w-full rounded-2xl p-5 shadow-2xl transition-all duration-200
              border border-neutral-300 dark:border-neutral-800
              bg-white dark:bg-[#0a0a0a]">
              
              {/* Mac dots */}
              <div className="mb-4 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              
              {/* Terminal Content */}
              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-blue-400">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>~/ ajie.dev</span>
                </div>
                <div className="mt-1 text-neutral-500">
                  <span className="text-green-400">{">"}</span> building amazing things...
                </div>
                <div className="flex gap-2 mt-2 transition-colors duration-200
                  text-neutral-600 dark:text-neutral-400">
                  <span className="text-purple-400">const</span>
                  <span className="text-neutral-900 dark:text-white">passion</span>
                  <span className="text-pink-400">=</span>
                  <span className="text-yellow-500 dark:text-yellow-300">{"'code'"}</span>
                  <span className="text-neutral-400 dark:text-neutral-500">;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl transition-all duration-200
            border border-neutral-300 dark:border-neutral-800
            bg-white dark:bg-neutral-900">
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="absolute -bottom-3 -left-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl transition-all duration-200
            border border-neutral-300 dark:border-neutral-800
            bg-white dark:bg-neutral-900">
            <Cpu className="h-5 w-5 text-blue-400" />
          </div>
        </div>

      </div>
    </div>
  );
}