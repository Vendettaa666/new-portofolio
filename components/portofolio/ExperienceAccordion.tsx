"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import SpotlightCard from '@/components/ui/SpotlightCard';

export default function ExperienceAccordion({ item, index }: { item: any; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className="w-full" 
    >
      <SpotlightCard 
        spotlightColor="color-mix(in srgb, var(--theme-primary) 30%, transparent)"
        className="w-full group flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl p-4 sm:p-5 overflow-hidden transition-all duration-300 !bg-white dark:!bg-neutral-800/50 border !border-neutral-200 hover:!border-neutral-300 dark:!border-neutral-700 dark:hover:!border-neutral-600" 
      > 
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl !bg-white dark:!bg-neutral-800 border !border-neutral-200 dark:!border-neutral-700 shadow-sm z-10 relative transition-all duration-300 overflow-hidden group-hover:!border-neutral-300 dark:group-hover:!border-neutral-600">
          {typeof item.logoIcon === "string" ? (
            <img 
              src={item.logoIcon} 
              alt={`${item.company || item.school || "Logo"}`} 
              className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110" 
            />
          ) : (
            <item.logoIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400 transition-all duration-300 group-hover:text-[var(--theme-primary)] group-hover:scale-110" />
          )}
        </div>
        <div className="flex flex-1 flex-col pt-0.5 z-10 relative">
          <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {item.role || item.degree}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            {item.company || item.school} <span className="mx-1 opacity-50">•</span> {item.location}
          </p>
          
          <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-500">
            <span>{item.startDate} - {item.endDate}</span>
            {item.duration && <><span className="opacity-50">•</span><span>{item.duration}</span></>}
            {item.type && <><span className="opacity-50">•</span><span>{item.type}</span></>}
            {item.workSetup && <><span className="opacity-50">•</span><span>{item.workSetup}</span></>}
          </div>

          {item.details && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mt-3 flex w-fit items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            >
              <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
              Tampilkan detail
            </button>
          )}

          <AnimatePresence>
            {isOpen && item.details && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 border-l-2 border-neutral-300 dark:border-neutral-700 pl-3 sm:pl-4">
                  {item.details}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}