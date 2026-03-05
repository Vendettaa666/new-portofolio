"use client";

import { motion } from "framer-motion";

export const skills = [
  { name: "Laravel", level: 75, color: "bg-[#FF2D20]" },
  { name: "TypeScript", level: 65, color: "bg-[#3178C6]" },
  { name: "Tailwind CSS", level: 75, color: "bg-[#06B6D4]" },
  { name: "Node.js", level: 55, color: "bg-[#339933]" },
  { name: "UI/UX Design", level: 75, color: "bg-[#FF61F6]" }, // Identik dengan Figma
  { name: "NEXT JS", level: 70, color: "bg-[#000000]" },
  { name: "Database", level: 65, color: "bg-[#4479A1]" },    // Identik dengan MySQL/SQL
  { name: "Git & GitHub", level: 80, color: "bg-[#F05032]" },
  { name: "Flutter", level: 45, color: "bg-[#02569B]" },
  { name: "RESTful API", level: 60, color: "bg-[#009688]" },
];


export default function SkillsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50"
    >
      <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-6 text-neutral-900 dark:text-neutral-100">
        Keahlian
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {skills.map((skill, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {skill.name}
              </span>
              <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
                {skill.level}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: "easeOut" }}
                className={`h-full ${skill.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}