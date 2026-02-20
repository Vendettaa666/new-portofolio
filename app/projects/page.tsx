"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star, GitFork } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce platform with payment integration, admin dashboard, and real-time inventory management.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://demo.com",
    stars: 234,
    forks: 45,
  },
  {
    title: "AI Chat Application",
    description: "Real-time chat application powered by AI with smart replies, sentiment analysis, and multi-language support.",
    image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&h=600&fit=crop",
    tags: ["React", "OpenAI", "Socket.io", "Node.js"],
    github: "https://github.com",
    demo: "https://demo.com",
    stars: 567,
    forks: 89,
  },
  {
    title: "Task Management System",
    description: "Collaborative task management tool with kanban boards, time tracking, and team analytics.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    tags: ["Vue.js", "Firebase", "Tailwind", "Chart.js"],
    github: "https://github.com",
    demo: "https://demo.com",
    stars: 123,
    forks: 34,
  },
  {
    title: "Weather Dashboard",
    description: "Beautiful weather dashboard with forecasts, maps, and historical data visualization.",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
    tags: ["React", "Weather API", "D3.js", "Mapbox"],
    github: "https://github.com",
    demo: "https://demo.com",
    stars: 89,
    forks: 23,
  },
  {
    title: "Portfolio Builder",
    description: "No-code portfolio builder with drag-and-drop interface and customizable templates.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    tags: ["Next.js", "DnD Kit", "Prisma", "Vercel"],
    github: "https://github.com",
    demo: "https://demo.com",
    stars: 456,
    forks: 67,
  },
  {
    title: "Fitness Tracker",
    description: "Mobile-first fitness tracking app with workout plans, progress charts, and social features.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    tags: ["React Native", "MongoDB", "Express", "JWT"],
    github: "https://github.com",
    demo: "https://demo.com",
    stars: 234,
    forks: 45,
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen space-y-8 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-neutral-900 dark:text-white">
          Projects
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          A collection of my recent work and side projects
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group rounded-3xl overflow-hidden border transition-all duration-200
              bg-neutral-50 dark:bg-neutral-900/40
              border-neutral-200 dark:border-neutral-800
              hover:border-neutral-300 dark:hover:border-neutral-700
              hover:shadow-xl"
          >
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Hover Actions */}
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
                >
                  <Github size={20} className="text-neutral-900 dark:text-white" />
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
                >
                  <ExternalLink size={20} className="text-neutral-900 dark:text-white" />
                </a>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 text-xs font-medium rounded-full
                      bg-blue-500/10 text-blue-600 dark:text-blue-400
                      border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" />
                  <span>{project.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork size={16} />
                  <span>{project.forks}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
