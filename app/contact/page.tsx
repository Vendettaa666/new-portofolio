"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useState } from "react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "leosatria@example.com",
    href: "mailto:leosatria@example.com",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+62 812 3456 7890",
    href: "tel:+6281234567890",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kudus, Indonesia",
    href: "#",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600 dark:text-red-400",
  },
];

const socialCards = [
  {
    icon: SiGmail,
    title: "Tetap Terhubung",
    description: "Hubungi saya melalui email untuk pertanyaan atau kolaborasi.",
    buttonText: "Pergi ke Gmail",
    href: "mailto:leosatria@example.com",
    gradient: "from-red-600 via-red-500 to-red-600",
    spotlightColor: "rgba(239, 68, 68, 0.3)",
  },
  {
    icon: FaInstagram,
    title: "Ikuti Perjalanan Saya",
    description: "Ikuti perjalanan kreatif saya.",
    buttonText: "Pergi ke Instagram",
    href: "https://instagram.com",
    gradient: "from-purple-600 via-pink-500 to-orange-500",
    spotlightColor: "rgba(236, 72, 153, 0.3)",
  },
  {
    icon: FaLinkedin,
    title: "Mari Terhubung",
    description: "Terhubung dengan saya secara profesional.",
    buttonText: "Pergi ke Linkedin",
    href: "https://linkedin.com",
    gradient: "from-blue-700 via-blue-600 to-blue-700",
    spotlightColor: "rgba(59, 130, 246, 0.3)",
  },
  {
    icon: FaGithub,
    title: "Jelajahi Kode",
    description: "Jelajahi karya sumber terbuka saya.",
    buttonText: "Pergi ke Github",
    href: "https://github.com",
    gradient: "from-gray-800 via-gray-700 to-gray-900",
    spotlightColor: "rgba(156, 163, 175, 0.3)",
  },
];


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col gap-10 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      
      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Have a project in mind or just want to chat? Feel free to reach out. I'm always open to discussing new opportunities and collaborations.
          </p>
        </div>
      </motion.div>


      {/* Social Media Cards with SpotlightCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <SpotlightCard
              className={`h-full bg-gradient-to-br ${card.gradient} border-0`}
              spotlightColor={card.spotlightColor}
            >
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base mb-6">
                    {card.description}
                  </p>
                </div>
                
                <div className="flex items-end justify-between">
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
                      bg-white/20 hover:bg-white/30 backdrop-blur-sm
                      text-white border border-white/30
                      transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {card.buttonText}
                    <ExternalLink size={16} />
                  </a>
                  
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <card.icon size={40} className="text-white" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-8 rounded-2xl border transition-all duration-200
          bg-white dark:bg-neutral-900/40
          border-neutral-200 dark:border-neutral-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
          Send Me a Message
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-900 dark:text-white">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                  bg-neutral-50 dark:bg-neutral-800
                  border-neutral-200 dark:border-neutral-700
                  text-neutral-900 dark:text-white
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  focus:border-primary dark:focus:border-primary
                  focus:ring-2 focus:ring-primary/20
                  outline-none"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-900 dark:text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                  bg-neutral-50 dark:bg-neutral-800
                  border-neutral-200 dark:border-neutral-700
                  text-neutral-900 dark:text-white
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  focus:border-primary dark:focus:border-primary
                  focus:ring-2 focus:ring-primary/20
                  outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-900 dark:text-white">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                bg-neutral-50 dark:bg-neutral-800
                border-neutral-200 dark:border-neutral-700
                text-neutral-900 dark:text-white
                placeholder-neutral-400 dark:placeholder-neutral-500
                focus:border-primary dark:focus:border-primary
                focus:ring-2 focus:ring-primary/20
                outline-none"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-900 dark:text-white">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                bg-neutral-50 dark:bg-neutral-800
                border-neutral-200 dark:border-neutral-700
                text-neutral-900 dark:text-white
                placeholder-neutral-400 dark:placeholder-neutral-500
                focus:border-primary dark:focus:border-primary
                focus:ring-2 focus:ring-primary/20
                outline-none resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200
              ${isSubmitting || submitStatus === "success"
                ? "bg-neutral-300 dark:bg-neutral-700 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 active:scale-95"
              }
              text-white
               shadow-primary/25
              hover:shadow-primary/30`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : submitStatus === "success" ? (
              <>
                <CheckCircle size={20} />
                Message Sent!
              </>
            ) : (
              <>
                <Send size={20} />
                Send Message
              </>
            )}
          </button>

          {/* Success Message */}
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
            >
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Thank you for your message! I'll get back to you soon.
              </p>
            </motion.div>
          )}
        </form>
      </motion.div>

    </div>
  );
}
