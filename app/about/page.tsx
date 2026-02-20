"use client";

import { motion } from "framer-motion";
import { Code2, Briefcase, GraduationCap, Award, Heart, Zap } from "lucide-react";

const skills = [
  { name: "React & Next.js", level: 90, color: "bg-blue-500" },
  { name: "TypeScript", level: 85, color: "bg-cyan-500" },
  { name: "Tailwind CSS", level: 95, color: "bg-teal-500" },
  { name: "Node.js", level: 80, color: "bg-green-500" },
  { name: "UI/UX Design", level: 75, color: "bg-purple-500" },
];

const experiences = [
  {
    icon: Briefcase,
    title: "Senior Frontend Developer",
    company: "Tech Company",
    period: "2022 - Present",
    description: "Leading frontend development team, building scalable web applications.",
  },
  {
    icon: Code2,
    title: "Full Stack Developer",
    company: "Startup Inc",
    period: "2020 - 2022",
    description: "Developed full-stack applications using modern technologies.",
  },
  {
    icon: GraduationCap,
    title: "Computer Science",
    company: "University",
    period: "2016 - 2020",
    description: "Bachelor's degree in Computer Science with honors.",
  },
];

const interests = [
  { icon: Code2, label: "Coding", color: "text-blue-400" },
  { icon: Award, label: "Learning", color: "text-green-400" },
  { icon: Heart, label: "Open Source", color: "text-red-400" },
  { icon: Zap, label: "Innovation", color: "text-yellow-400" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen space-y-8 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-neutral-900 dark:text-white">
          About Me
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Get to know more about my background, skills, and interests
        </p>
      </motion.div>

      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-3xl p-8 border transition-all duration-200
          bg-neutral-50 dark:bg-neutral-900/40
          border-neutral-200 dark:border-neutral-800"
      >
        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
          👋 Hello!
        </h2>
        <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
          <p>
            Saya adalah seorang Software Engineer yang passionate dalam membangun aplikasi web modern
            dan user-friendly. Dengan pengalaman lebih dari 4 tahun di industri teknologi, saya telah
            mengerjakan berbagai proyek dari startup hingga perusahaan besar.
          </p>
          <p>
            Saya percaya bahwa teknologi harus membuat hidup lebih mudah, dan itulah yang saya coba
            wujudkan dalam setiap proyek yang saya kerjakan. Saya selalu bersemangat untuk belajar
            teknologi baru dan berbagi pengetahuan dengan komunitas.
          </p>
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl p-8 border transition-all duration-200
          bg-neutral-50 dark:bg-neutral-900/40
          border-neutral-200 dark:border-neutral-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
          💪 Skills
        </h2>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-neutral-900 dark:text-white">
                  {skill.name}
                </span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  className={`h-full ${skill.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Experience Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl p-8 border transition-all duration-200
          bg-neutral-50 dark:bg-neutral-900/40
          border-neutral-200 dark:border-neutral-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
          🚀 Experience & Education
        </h2>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                bg-blue-500/10 text-blue-400">
                <exp.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  {exp.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {exp.company} • {exp.period}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interests Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-3xl p-8 border transition-all duration-200
          bg-neutral-50 dark:bg-neutral-900/40
          border-neutral-200 dark:border-neutral-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
          ❤️ Interests
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {interests.map((interest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200
                bg-white dark:bg-neutral-800/50
                border-neutral-200 dark:border-neutral-700
                hover:border-neutral-300 dark:hover:border-neutral-600
                hover:shadow-lg"
            >
              <interest.icon size={32} className={interest.color} />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {interest.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
