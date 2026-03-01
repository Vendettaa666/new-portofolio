"use client";

import { motion } from "framer-motion";
import { Eye, Briefcase, Calendar, Code2, Pin, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import GlareHover from "@/components/ui/GlareHover";
import { listProyek } from "@/lib/data";

type SortOrder = "newest" | "oldest";

export default function ProjectsPage() {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // 1. LOGIKA SORTING & PINNED
  const sortedProjects = useMemo(() => {
    return [...listProyek].sort((a, b) => {
      // Prioritaskan pinned: true
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Jika sama-sama pinned atau sama-sama tidak, urutkan berdasarkan ID
      if (sortOrder === "newest") {
        return b.id - a.id; // ID besar dulu (terbaru)
      } else {
        return a.id - b.id; // ID kecil dulu (terlama)
      }
    });
  }, [sortOrder]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProjects = sortedProjects.length;
    const uniqueTools = new Set(sortedProjects.flatMap((p) => p.tools)).size;
    const latestYear = Math.max(...sortedProjects.map((p) => parseInt(p.year)));

    return { totalProjects, uniqueTools, latestYear };
  }, [sortedProjects]);

  return (
    <div className="min-h-screen max-w-9xl mx-auto flex flex-col gap-10 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-4 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
              My Projects
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Explore my collection of web development projects, sorted by latest work and featured highlights.
            </p>
          </div>

          {/* Sort Button */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder("newest")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                sortOrder === "newest"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary"
              }`}
            >
              <ArrowUpDown size={16} />
              Terbaru
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                sortOrder === "oldest"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary"
              }`}
            >
              <ArrowUpDown size={16} />
              Terlama
            </button>
          </div>
        </div>

        {/* Stats Bar - Horizontal Layout */}
        <div
          className="flex flex-wrap items-center gap-6 p-6 rounded-2xl border transition-all duration-200
          bg-white dark:bg-neutral-800/50
          border-neutral-200 dark:border-neutral-700
          shadow-sm hover:shadow-md"
        >
          {/* Total Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Briefcase
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats.totalProjects}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Total Projects
              </p>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-neutral-200 dark:bg-neutral-800" />

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/10">
              <Code2
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats.uniqueTools}+
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Technologies
              </p>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-neutral-200 dark:bg-neutral-800" />

          {/* Latest Year */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-green-500/10">
              <Calendar
                size={20}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats.latestYear}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Latest Year
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project, index) => (
          <GlareHover
            key={project.id}
            width="100%"
            height="100%"
            background="transparent"
            borderRadius="1.5rem"
            className="flex flex-col"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className="w-full h-full"
            >
              <div className="relative w-full h-full overflow-hidden rounded-[1.5rem]">
                <div className="relative h-full flex flex-col bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-[1.5rem] overflow-hidden group hover:border-primary/50 transition-all duration-300">
                  
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-52 overflow-hidden bg-neutral-900">
                    {/* LABEL PINNED */}
                    {project.pinned && (
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse">
                        <Pin size={12} className="fill-current" />
                        Featured
                      </div>
                    )}

                    <img
                      src={typeof project.gambar === "string" ? project.gambar : project.gambar.src}
                      alt={project.nama}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* OVERLAY & BUTTON */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
                      <a href={project.url} target="_blank" className="flex items-center gap-2 bg-white text-neutral-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary hover:text-white transition-all">
                        <Eye size={18} /> View Project
                      </a>
                    </div>
                  </div>

                  {/* CONTENT AREA */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow space-y-4">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                        {project.nama}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-2">
                        {project.desk}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.map((tag, i) => (
                          <span key={i} className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* BOTTOM STATS */}
                    <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800/50 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                        {project.role}
                      </span>
                      <span className="text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-3 py-1.5 rounded-full">
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </GlareHover>
        ))}
      </div>
    </div>
  );
}