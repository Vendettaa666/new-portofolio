"use client";

import {
  Home, User, Briefcase, Code, Mail, Layers,
  Download, Settings, LogOut, ChevronLeft, ChevronRight, Copyright
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
      className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-[#0a0a0a] border-r border-neutral-800 z-50 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-72"
        }`}
    >

      {/* TOGGLE BUTTON (Absolute di garis batas) */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-neutral-800 border border-neutral-700 text-white p-1 rounded-full hover:bg-neutral-700 transition-colors z-50 shadow-xl"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* 1. Header / Logo
      <div className={`p-6 pb-2 flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
          P
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl tracking-tighter whitespace-nowrap overflow-hidden transition-all duration-300">
            Portofolio.
          </span>
        )}
      </div> */}

      {/* 2. Profile & CV Section */}
      <div className={`flex flex-col items-center transition-all duration-300 ease-in-out ${isCollapsed
          ? "mx-2 mt-4 mb-6 p-2 bg-transparent border-transparent"
          : "mx-3 mt-4 mb-6 p-5 bg-gradient-to-b from-neutral-800/40 to-neutral-900/40 border border-neutral-800 rounded-2xl shadow-sm"
        }`}>

        {/* Profile Image Area */}
        <div className={`relative transition-all duration-300 ${isCollapsed ? "mb-0" : "mb-4"}`}>

          {/* Container Foto */}
          <div className={`relative rounded-full overflow-hidden border border-neutral-700 shadow-lg transition-all duration-300 ${isCollapsed ? "w-10 h-10 ring-0" : "w-30 h-30 ring-4 ring-neutral-900"
            }`}>
            <img
              src="/assets/profile.png"
              alt="User"
              className="w-full h-full object-cover bg-neutral-800"
            />
          </div>

          {/* Status Indicator (Hanya muncul saat Expanded biar ga semak saat kecil) */}
          {!isCollapsed && (
            <div className="absolute bottom-0 right-0 bg-neutral-900 p-1 rounded-full">
              <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-medium text-green-500 leading-none">Open</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Text & Button */}
        <div className={`flex flex-col items-center w-full transition-all duration-300 ${isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
          }`}>
          <h3 className="text-white font-semibold text-base tracking-tight">Leo Satria Anugrah</h3>
          <p className="text-neutral-500 text-xs mb-4 font-medium">Web Developer</p>

          {/* Button yang lebih 'Professional' (Dark Theme Friendly) */}
          <button className="group w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 text-neutral-200 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95">
            <Download size={14} className="text-neutral-400 group-hover:text-white transition-colors" />
            <span>Resume</span>
          </button>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar no-scrollbar">
        {!isCollapsed && (
          <p className="text-xs font-semibold text-neutral-500 px-4 mb-2 uppercase tracking-wider whitespace-nowrap">Menu</p>
        )}

        <nav className="flex flex-col gap-1.5 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center relative transition-all duration-300 ${isCollapsed
                    ? "justify-center w-12 h-12 rounded-xl" // Kotak kecil saat collapsed
                    : "gap-3 px-4 py-3 w-full rounded-xl"   // Persegi panjang saat expanded
                  } ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
                  }`}
                title={isCollapsed ? item.label : ""} // Tooltip sederhana saat collapsed
              >
                {/* Icon */}
                <item.icon
                  size={20}
                  className={`transition-colors duration-300 shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`}
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
      <div className={`p-4 border-t border-neutral-800 transition-all duration-300 ${isCollapsed ? "flex justify-center" : ""}`}>

        {isCollapsed ? (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 text-neutral-500" title="© 2024 Dev Name">
            <Copyright size={16} />
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 animate-in fade-in duration-300">
            <p className="text-xs font-medium text-neutral-400 flex items-center gap-1">
              <Copyright size={12} /> 2024 Dev Name
            </p>
            <p className="text-[10px] text-neutral-600">
              Built with Next.js & Tailwind
            </p>
          </div>
        )}

      </div>
    </aside>
  );
}