"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Briefcase, 
  GraduationCap, 
  ChevronRight,
  Building2,
  Library
} from "lucide-react";

// --- DATA ---
const skills = [
  { name: "React & Next.js", level: 90, color: "bg-blue-500" },
  { name: "TypeScript", level: 85, color: "bg-cyan-500" },
  { name: "Tailwind CSS", level: 95, color: "bg-teal-500" },
  { name: "Node.js", level: 80, color: "bg-green-500" },
  { name: "UI/UX Design", level: 75, color: "bg-purple-500" },
  { name: "Golang", level: 70, color: "bg-cyan-600" },
  { name: "PostgreSQL", level: 85, color: "bg-indigo-500" },
  { name: "Git & GitHub", level: 90, color: "bg-orange-500" },
  { name: "Docker", level: 65, color: "bg-blue-600" },
  { name: "RESTful API", level: 88, color: "bg-emerald-500" },
];

const careers = [
  {
    role: "Backend Golang Developer",
    company: "Pt. Affan Technology Indonesia (Parto.id)",
    location: "Jambi, Indonesia",
    startDate: "Jul 2023",
    endDate: "Sep 2023",
    duration: "2 bulan",
    type: "Internship",
    workSetup: "Hybrid",
    logoIcon: Building2,
    details: "Membangun dan memelihara RESTful API menggunakan Golang. Mengoptimalkan query database PostgreSQL dan mengimplementasikan arsitektur microservices untuk skalabilitas sistem.",
  },
  {
    role: "Full Stack Developer",
    company: "Tech Startup Inc",
    location: "Jakarta, Indonesia",
    startDate: "Jan 2021",
    endDate: "Des 2022",
    duration: "2 tahun",
    type: "Full-time",
    workSetup: "Remote",
    logoIcon: Code2,
    details: "Mengembangkan aplikasi web full-stack menggunakan Next.js dan Node.js. Berkolaborasi dengan tim desain untuk mengimplementasikan UI/UX yang responsif dan interaktif.",
  }
];

const educations = [
  {
    degree: "Sarjana Komputer, Sistem Informasi",
    school: "Universitas Jambi (UNJA)",
    location: "Jambi, Indonesia",
    startDate: "Aug 2020",
    endDate: "Jul 2024",
    duration: "4 tahun",
    type: "Gelar Sarjana",
    workSetup: "Onsite",
    logoIcon: Library,
    details: "Lulus dengan predikat Cum Laude (IPK 3.85). Aktif sebagai Kepala Divisi Teknologi di Himpunan Mahasiswa Sistem Informasi (HIMASI UNJA).",
  }
];

// --- KOMPONEN ACCORDION KARIER & PENDIDIKAN ---
const ExperienceAccordion = ({ item, index }: { item: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className="group flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-4 sm:p-5 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm">
        <item.logoIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
      </div>

      <div className="flex flex-1 flex-col pt-0.5">
        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {item.role || item.degree}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          {item.company || item.school} <span className="mx-1 opacity-50">•</span> {item.location}
        </p>
        
        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-500">
          <span>{item.startDate} - {item.endDate}</span>
          <span className="opacity-50">•</span>
          <span>{item.duration}</span>
          <span className="opacity-50">•</span>
          <span>{item.type}</span>
          <span className="opacity-50">•</span>
          <span>{item.workSetup}</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-3 flex w-fit items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
        >
          <ChevronRight 
            className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} 
          />
          Tampilkan detail
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 border-l-2 border-neutral-200 dark:border-neutral-800 pl-3 sm:pl-4">
                {item.details}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- HALAMAN UTAMA ---
export default function AboutPage() {
  return (
    <div className="min-h-screen max-w-9xl mx-auto flex flex-col gap-8 md:gap-12 p-4 md:p-6 lg:p-8 lg:py-12 transition-colors duration-200">
      
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

      {/* Bio Section */}
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
            <p>
              Saya memadukan keahlian teknis dengan komunikasi proaktif, berpikir kritis, dan manajemen waktu yang efektif. 
              Saya berkembang dalam lingkungan kolaboratif dan memastikan setiap proyek memberikan hasil optimal.
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

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
      >
        <h2 className="text-xl font-bold mb-6 text-neutral-900 dark:text-white">
          💪 Keahlian
        </h2>
        {/* Menggunakan grid 2 kolom agar 10 list tidak terlalu panjang ke bawah */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {skill.name}
                </span>
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
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

      {/* Karier Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Briefcase className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Karier
          </h2>
        </div>
        
        <div className="flex flex-col gap-4">
          {careers.map((career, index) => (
            <ExperienceAccordion key={`career-${index}`} item={career} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Pendidikan Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Pendidikan
          </h2>
        </div>
        
        <div className="flex flex-col gap-4">
          {educations.map((edu, index) => (
            <ExperienceAccordion key={`edu-${index}`} item={edu} index={index} />
          ))}
        </div>
      </motion.div>

    </div>
  );
}