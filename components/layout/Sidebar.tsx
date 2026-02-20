"use client";

import {
  Home, User, Layers, Code, Mail,
  Download, ChevronLeft, ChevronRight, Copyright
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: User, label: "About", href: "/about" },
  { icon: Layers, label: "Projects", href: "/projects" },
  { icon: Code, label: "Stack", href: "/stack" },
  { icon: Mail, label: "Contact", href: "/contact" },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out
        bg-white dark:bg-[#0a0a0a]
        border-r border-neutral-200 dark:border-neutral-800
        ${isCollapsed ? "w-20" : "w-72"}`}
    >

      {/* TOGGLE BUTTON */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 z-50 p-1 rounded-full shadow-xl transition-all duration-200
          bg-neutral-200 dark:bg-neutral-800
          border border-neutral-300 dark:border-neutral-700
          text-neutral-700 dark:text-white
          hover:bg-neutral-300 dark:hover:bg-neutral-700
          hover:scale-110 active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Profile & CV Section */}
      <div className={`flex flex-col items-center transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "mx-2 mt-4 mb-6 p-2 bg-transparent border-transparent"
          : "mx-3 mt-4 mb-6 p-5 rounded-2xl shadow-sm bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900/40 dark:to-neutral-900/20 border border-neutral-200 dark:border-neutral-800"
      }`}>

        {/* Profile Image */}
        <div className={`relative transition-all duration-300 ${isCollapsed ? "mb-0" : "mb-4"}`}>
          <div className={`relative rounded-full overflow-hidden border transition-all duration-300
            border-neutral-300 dark:border-neutral-700 shadow-lg
            ${isCollapsed ? "w-10 h-10 ring-0" : "w-30 h-30 ring-4 ring-neutral-200 dark:ring-neutral-900"}`}>
            <img
              src="/assets/profile.png"
              alt="User"
              className="w-full h-full object-cover bg-neutral-200 dark:bg-neutral-800"
            />
          </div>

          {!isCollapsed && (
            <div className="absolute bottom-0 right-0 bg-white dark:bg-neutral-900 p-1 rounded-full shadow-md">
              <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-medium text-green-500 leading-none">Open</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Text & Button */}
        <div className={`flex flex-col items-center w-full transition-all duration-300 ${
          isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
        }`}>
          <h3 className="font-semibold text-base tracking-tight text-neutral-900 dark:text-white">
            Leo Satria Anugrah
          </h3>
          <p className="text-xs mb-4 font-medium text-neutral-500 dark:text-neutral-400">Web Developer</p>

          <button className="group w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 text-xs font-medium
            bg-neutral-200 dark:bg-neutral-800
            hover:bg-neutral-300 dark:hover:bg-neutral-700
            border border-neutral-300 dark:border-neutral-700
            hover:border-neutral-400 dark:hover:border-neutral-600
            text-neutral-700 dark:text-neutral-200
            shadow-sm hover:shadow-md">
            <Download size={14} className="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
            <span>Resume</span>
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        {!isCollapsed && (
          <p className="text-xs font-semibold px-4 mb-2 uppercase tracking-wider whitespace-nowrap text-neutral-400 dark:text-neutral-500">
            Menu
          </p>
        )}

        <nav className="flex flex-col gap-1.5 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center relative transition-all duration-200 ${
                  isCollapsed
                    ? "justify-center w-12 h-12 rounded-xl"
                    : "gap-3 px-4 py-3 w-full rounded-xl"
                } ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon
                  size={20}
                  className={`transition-colors duration-200 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white"
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap overflow-hidden">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t transition-all duration-200 border-neutral-200 dark:border-neutral-800 ${isCollapsed ? "flex justify-center" : ""}`}>
        {isCollapsed ? (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500" title="© 2024 Dev Name">
            <Copyright size={16} />
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <Copyright size={12} /> 2024 Dev Name
            </p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-600">
              Built with Next.js & Tailwind
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}