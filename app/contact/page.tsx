"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    color: "text-blue-500",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+62 812 3456 7890",
    href: "tel:+6281234567890",
    color: "text-green-500",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kudus, Indonesia",
    href: "#",
    color: "text-red-500",
  },
];

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com",
    color: "hover:text-neutral-900 dark:hover:text-white",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com",
    color: "hover:text-blue-600",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com",
    color: "hover:text-sky-500",
  },
  {
    icon: MessageCircle,
    label: "Discord",
    href: "https://discord.com",
    color: "hover:text-indigo-500",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen space-y-8 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-neutral-900 dark:text-white">
          Get In Touch
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Have a project in mind? Let's work together!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contact Info & Social */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Contact Info Cards */}
          {contactInfo.map((info, index) => (
            <motion.a
              key={index}
              href={info.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="block p-6 rounded-3xl border transition-all duration-200
                bg-neutral-50 dark:bg-neutral-900/40
                border-neutral-200 dark:border-neutral-800
                hover:border-neutral-300 dark:hover:border-neutral-700
                hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white dark:bg-neutral-800 ${info.color}`}>
                  <info.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    {info.label}
                  </p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {info.value}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-3xl border transition-all duration-200
              bg-neutral-50 dark:bg-neutral-900/40
              border-neutral-200 dark:border-neutral-800"
          >
            <h3 className="font-bold mb-4 text-neutral-900 dark:text-white">
              Follow Me
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all duration-200
                    bg-white dark:bg-neutral-800
                    border border-neutral-200 dark:border-neutral-700
                    hover:border-neutral-300 dark:hover:border-neutral-600
                    text-neutral-600 dark:text-neutral-400
                    ${social.color}
                    hover:scale-110 active:scale-95`}
                  title={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 p-8 rounded-3xl border transition-all duration-200
            bg-neutral-50 dark:bg-neutral-900/40
            border-neutral-200 dark:border-neutral-800"
        >
          <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
            Send Me a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                    bg-white dark:bg-neutral-800
                    border-neutral-200 dark:border-neutral-700
                    text-neutral-900 dark:text-white
                    placeholder-neutral-400 dark:placeholder-neutral-500
                    focus:border-blue-500 dark:focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20
                    outline-none"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                    bg-white dark:bg-neutral-800
                    border-neutral-200 dark:border-neutral-700
                    text-neutral-900 dark:text-white
                    placeholder-neutral-400 dark:placeholder-neutral-500
                    focus:border-blue-500 dark:focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20
                    outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                  bg-white dark:bg-neutral-800
                  border-neutral-200 dark:border-neutral-700
                  text-neutral-900 dark:text-white
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  focus:border-blue-500 dark:focus:border-blue-500
                  focus:ring-2 focus:ring-blue-500/20
                  outline-none"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                  bg-white dark:bg-neutral-800
                  border-neutral-200 dark:border-neutral-700
                  text-neutral-900 dark:text-white
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  focus:border-blue-500 dark:focus:border-blue-500
                  focus:ring-2 focus:ring-blue-500/20
                  outline-none resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200
                bg-blue-600 hover:bg-blue-700
                text-white
                shadow-lg shadow-blue-500/25
                hover:shadow-xl hover:shadow-blue-500/30
                active:scale-95"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        </motion.div>

      </div>

    </div>
  );
}
