"use client";

import { motion } from "framer-motion";
import { Github, Eye, Briefcase, Calendar, Code2 } from "lucide-react";
import { useMemo } from "react";
import GlareHover from "@/components/ui/GlareHover";

import Proyek1 from "@/public/assets/projects/bukutahunansiswa.png";
import Proyek2 from "@/public/assets/projects/simpadwebsite.png";
import Proyek3 from "@/public/assets/projects/smestawebsite.png";
import Proyek4 from "@/public/assets/projects/misiwebsite.png";
import Proyek5 from "@/public/assets/projects/websitesagti.png";
import Proyek6 from "@/public/assets/projects/empowerin.png";
import Proyek7 from "@/public/assets/projects/cvalpanagrojaya.png";
import Proyek8 from "@/public/assets/projects/blessingstore.png";
import Proyek9 from "@/public/assets/projects/webujian.png";

export const listProyek = [
  {
    id: 1,
    gambar: Proyek1,
    nama: "Buku Tahunan Siswa",
    desk: "Buku Tahunan Siswa SMKN 1 LUMAJANG",
    tools: ["HTML", "CSS", "Javascript", "PHP"],
    url: "https://jurnalistik.smkn1lmj.sch.id/bts-smk/",
    github: "#",
    role: "Fullstack Dev",
    year: "2025",
  },
  {
    id: 2,
    gambar: Proyek2,
    nama: "Website Simpad",
    desk: "Website Pajak Daerah Kabupaten Kudus",
    tools: ["Laravel", "Bootstrap", "Javascript", "PHP"],
    url: "https://staging-simpadkuduskab.nusantaratama.com/",
    github: "#",
    role: "Frontend Dev",
    year: "2025",
  },
  {
    id: 3,
    gambar: Proyek3,
    nama: "Smesta Website",
    desk: "E-Catalog UKM",
    tools: ["Laravel", "Tailwind", "Javascript", "PHP"],
    url: "https://staging-smesta.nusantaratama.com/",
    github: "#",
    role: "Frontend Dev",
    year: "2025",
  },
  {
    id: 4,
    gambar: Proyek4,
    nama: "Misi Website",
    desk: "Aplikasi Manajemen Informasi Peserta Magang Tamara Management",
    tools: ["Laravel", "Bootstrap", "Javascript", "PHP"],
    url: "https://dev-misi.nusantaratama.com/",
    github: "#",
    role: "Frontend Dev",
    year: "2025",
  },
  {
    id: 5,
    gambar: Proyek5,
    nama: "Website Sagti",
    desk: "APLIKASI E COMMERCE CV SAGTI",
    tools: ["Laravel", "Tailwind", "Javascript", "PHP"],
    url: "https://staging-depo.nusantaratama.com/",
    github: "#",
    role: "Frontend Dev",
    year: "2025",
  },
  {
    id: 6,
    gambar: Proyek6,
    nama: "Empowerin",
    desk: "APLIKASI BAKTI SOSIAL DAN PELATIHAN",
    tools: ["Laravel", "Tailwind", "Javascript", "PHP"],
    url: "https://staging-empowerin.tamaramanagement.co.id/",
    github: "#",
    role: "Fullstack Dev",
    year: "2025",
  },
  {
    id: 7,
    gambar: Proyek7,
    nama: "Alpan Agro Jaya",
    desk: "Company Profile Alpan Agro Jaya",
    tools: ["Next JS", "Tailwind", "Javascript", "Node JS"],
    url: "https://alpan-agro-jaya.vercel.app",
    github: "#",
    role: "Frontend Dev",
    year: "2026",
  },
  {
    id: 8,
    gambar: Proyek8,
    nama: "Blessing Store",
    desk: "Company Profile Blessing Store",
    tools: ["Next JS", "Tailwind", "Javascript", "Node JS"],
    url: "https://praktikum-sizie.vercel.app/",
    github: "#",
    role: "Frontend Dev",
    year: "2026",
  },
  {
    id: 9,
    gambar: Proyek9,
    nama: "Value Academy",
    desk: "Website Ujian Value Academy",
    tools: ["Laravel", "Tailwind", "Javascript", "Node JS"],
    url: "https://ourvalueacademy.com/",
    github: "#",
    role: "Fullstack Dev",
    year: "2026",
  },
];

export default function ProjectsPage() {
  // Calculate stats
  const stats = useMemo(() => {
    const totalProjects = listProyek.length;
    const uniqueTools = new Set(listProyek.flatMap((p) => p.tools)).size;
    const latestYear = Math.max(...listProyek.map((p) => parseInt(p.year)));

    return {
      totalProjects,
      uniqueTools,
      latestYear,
    };
  }, []);

  return (
    <div className="min-h-screen max-w-9xl mx-auto flex flex-col gap-10 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Title Section with Badge */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
              My Projects
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Explore my collection of web development projects, from full-stack
              applications to modern frontend solutions
            </p>
          </div>
        </div>

        {/* Stats Bar - Horizontal Layout */}
        <div
          className="flex flex-wrap items-center gap-6 p-6 rounded-2xl border transition-all duration-200
          bg-gradient-to-r from-neutral-50 via-white to-neutral-50 dark:from-neutral-900/40 dark:via-neutral-900/20 dark:to-neutral-900/40
          border-neutral-200 dark:border-neutral-800
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
        {listProyek.map((project, index) => (
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
              transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
              className="w-full h-full"
            >
              <div className="relative w-full h-full overflow-hidden rounded-[1.5rem]">
                <div className="relative h-full flex flex-col bg-white dark:bg-[#111] border border-neutral-300 dark:border-neutral-800 rounded-[1.5rem] overflow-hidden group hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-300">
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-52 overflow-hidden bg-neutral-900">
                    <img
                      src={
                        typeof project.gambar === "string"
                          ? project.gambar
                          : project.gambar.src
                      }
                      alt={project.nama}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white text-neutral-900 px-6 py-3 rounded-full font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white shadow-xl"
                      >
                        <Eye size={18} />
                        View Project
                      </a>
                    </div>
                    {/* GitHub Badge */}
                    {project.github !== "#" && (
                      <div className="absolute top-4 right-4 z-20">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white hover:text-black transition-all shadow-lg"
                        >
                          <Github size={18} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* CONTENT AREA */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow space-y-4">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-2">
                        {project.nama}
                      </h3>

                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-2">
                        {project.desk}
                      </p>

                      {/* Tools - Show All */}
                      <div className="flex flex-wrap gap-2">
                        {project.tools.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 rounded-lg
                              bg-primary/10 text-primary
                              border border-primary/20
                              hover:bg-primary/20 transition-colors"
                          >
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
