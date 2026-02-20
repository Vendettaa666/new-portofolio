"use client";

import { motion } from "framer-motion";

const techStack = [
  {
    category: "Frontend",
    icon: "🎨",
    color: "from-blue-500 to-cyan-500",
    technologies: [
      { name: "React", level: "Expert", icon: "⚛️" },
      { name: "Next.js", level: "Expert", icon: "▲" },
      { name: "TypeScript", level: "Advanced", icon: "📘" },
      { name: "Tailwind CSS", level: "Expert", icon: "🎨" },
      { name: "Framer Motion", level: "Advanced", icon: "🎬" },
    ],
  },
  {
    category: "Backend",
    icon: "⚙️",
    color: "from-green-500 to-emerald-500",
    technologies: [
      { name: "Node.js", level: "Advanced", icon: "🟢" },
      { name: "Express", level: "Advanced", icon: "🚂" },
      { name: "PostgreSQL", level: "Intermediate", icon: "🐘" },
      { name: "MongoDB", level: "Advanced", icon: "🍃" },
      { name: "Prisma", level: "Advanced", icon: "🔷" },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: "🛠️",
    color: "from-purple-500 to-pink-500",
    technologies: [
      { name: "Git & GitHub", level: "Expert", icon: "🐙" },
      { name: "Docker", level: "Intermediate", icon: "🐳" },
      { name: "Vercel", level: "Advanced", icon: "▲" },
      { name: "AWS", level: "Intermediate", icon: "☁️" },
      { name: "CI/CD", level: "Advanced", icon: "🔄" },
    ],
  },
  {
    category: "Design",
    icon: "🎭",
    color: "from-orange-500 to-red-500",
    technologies: [
      { name: "Figma", level: "Advanced", icon: "🎨" },
      { name: "Adobe XD", level: "Intermediate", icon: "🎨" },
      { name: "UI/UX Design", level: "Advanced", icon: "✨" },
      { name: "Responsive Design", level: "Expert", icon: "📱" },
      { name: "Accessibility", level: "Advanced", icon: "♿" },
    ],
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Expert":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    case "Advanced":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "Intermediate":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    default:
      return "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20";
  }
};

export default function StackPage() {
  return (
    <div className="min-h-screen space-y-8 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-neutral-900 dark:text-white">
          Tech Stack
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Technologies and tools I use to build amazing products
        </p>
      </motion.div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {techStack.map((stack, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-3xl overflow-hidden border transition-all duration-200
              bg-neutral-50 dark:bg-neutral-900/40
              border-neutral-200 dark:border-neutral-800
              hover:border-neutral-300 dark:hover:border-neutral-700
              hover:shadow-xl"
          >
            {/* Category Header */}
            <div className={`p-6 bg-gradient-to-r ${stack.color}`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{stack.icon}</span>
                <h2 className="text-2xl font-bold text-white">
                  {stack.category}
                </h2>
              </div>
            </div>

            {/* Technologies List */}
            <div className="p-6 space-y-3">
              {stack.technologies.map((tech, techIndex) => (
                <motion.div
                  key={techIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + techIndex * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-200
                    bg-white dark:bg-neutral-800/50
                    border border-neutral-200 dark:border-neutral-700
                    hover:border-neutral-300 dark:hover:border-neutral-600
                    hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tech.icon}</span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {tech.name}
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getLevelColor(tech.level)}`}>
                    {tech.level}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-3xl p-8 border transition-all duration-200
          bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20
          border-neutral-200 dark:border-neutral-800"
      >
        <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
          🚀 Always Learning
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Technology evolves rapidly, and I'm committed to continuous learning. Currently exploring:
        </p>
        <div className="flex flex-wrap gap-3">
          {["Rust", "Web3", "AI/ML", "GraphQL", "Microservices"].map((tech, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              className="px-4 py-2 rounded-full font-medium
                bg-white dark:bg-neutral-800
                border border-neutral-300 dark:border-neutral-700
                text-neutral-900 dark:text-white
                hover:border-neutral-400 dark:hover:border-neutral-600
                transition-colors duration-200"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
