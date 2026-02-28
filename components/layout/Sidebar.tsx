"use client";

import {
  Home,
  User,
  Layers,
  Mail,
  Download,
  ChevronLeft,
  ChevronRight,
  Copyright,
  X,
  Trophy,
  MessageCircle,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: User, label: "About", href: "/about" },
  { icon: Layers, label: "Projects", href: "/projects" },
  { icon: Trophy, label: "Achivement", href: "/achivement" },
  { icon: Activity, label: "Dashboard", href: "/dashboard" },
  { icon: MessageCircle, label: "Chat", href: "/chat"},
  { icon: Mail, label: "Contact", href: "/contact" },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

interface SidebarContentProps {
  mobile?: boolean;
  pathname: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobile: () => void;
}

function SidebarContent({
  mobile = false,
  pathname,
  isCollapsed,
  toggleSidebar,
  closeMobile,
}: SidebarContentProps) {
  return (
    <>
      {/* Close button - mobile only */}
      {mobile && (
        <button
          onClick={closeMobile}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors
            text-neutral-500 hover:text-neutral-900 dark:hover:text-white
            hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X size={18} />
        </button>
      )}

      {/* TOGGLE BUTTON - desktop only */}
      {!mobile && (
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
      )}

      {/* Profile & CV Section */}
      <div
        className={`flex flex-col items-center transition-all duration-300 ease-in-out ${!mobile && isCollapsed
          ? "mx-2 mt-4 mb-6 p-2 bg-transparent border-transparent"
          : mobile
            ? "mx-3 mt-16 mb-6"
            : "mx-3 mt-4 mb-6"
          }`}
      >
        {/* Profile Card with Gradient Background */}
        {(mobile || !isCollapsed) && (
          <div className="w-full relative overflow-hidden rounded-2xl p-6">
            {/* Decorative Elements */}
            {/* <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div> */}
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Profile Image with Enhanced Styling */}
              <div className="relative mb-4">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white dark:border-neutral-700 shadow-xl ring-4 ring-primary/10 dark:ring-primary/20">
                  <img
                    src="/assets/profile.png"
                    alt="Leo Satria Anugrah"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Status Badge */}
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-800 p-1.5 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] font-bold text-green-600 dark:text-green-400 leading-none uppercase tracking-wide">
                      Open
                    </span>
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white mb-1">
                  Leo Satria Anugrah
                </h3>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary"></span>
                  Web Developer
                  <span className="w-1 h-1 rounded-full bg-primary"></span>
                </p>
              </div>

              {/* Download CV Button */}
              <button className="group w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 text-sm font-semibold shadow-md hover:shadow-xl bg-primary hover:bg-primary/90 text-white border border-primary/20">
                <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
                <span>Download CV</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsed State - Just Avatar */}
        {!mobile && isCollapsed && (
          <div className="relative">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
              <img
                src="/assets/profile.png"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-neutral-800 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar">
        {(mobile || !isCollapsed) && (
          <div className="flex items-center gap-2 px-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
              Navigation
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
          </div>
        )}

        <nav className="flex flex-col gap-1.5 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const collapsed = !mobile && isCollapsed;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={mobile ? closeMobile : undefined}
                className={`group flex items-center relative transition-all duration-200 ${collapsed
                  ? "justify-center w-12 h-12 rounded-xl"
                  : "gap-3 px-4 py-3 w-full rounded-xl"
                  } ${isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25 scale-[1.02]"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:text-neutral-900 dark:hover:text-white hover:scale-[1.01]"
                  }`}
                title={collapsed ? item.label : ""}
              >
                {/* Icon with background */}
                <div className={`flex items-center justify-center transition-all duration-200 ${
                  collapsed ? "" : "w-8 h-8 rounded-lg"
                } ${
                  isActive 
                    ? "bg-white/20" 
                    : "bg-transparent group-hover:bg-neutral-200 dark:group-hover:bg-neutral-600/30"
                }`}>
                  <item.icon
                    size={18}
                    className={`transition-all duration-200 ${isActive
                      ? "text-white"
                      : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white"
                      }`}
                  />
                </div>
                
                {!collapsed && (
                  <>
                    <span className="font-semibold text-sm whitespace-nowrap overflow-hidden flex-1">
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-neutral-200 dark:border-neutral-700 ${!mobile && isCollapsed ? "flex justify-center" : ""}`}>
        {!mobile && isCollapsed ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors cursor-pointer">
            <Copyright size={18} />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-[10px] font-bold">
                LS
              </div>
              <span>Leo Satria</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-500 flex items-center gap-1">
              <Copyright size={10} /> 2024 • Built with Next.js
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  closeMobile,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={`hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out
          bg-white dark:bg-neutral-800
          border-r border-neutral-200 dark:border-neutral-700
          ${isCollapsed ? "w-20" : "w-72"}`}
      >
        <SidebarContent
          mobile={false}
          pathname={pathname}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          closeMobile={closeMobile}
        />
      </aside>

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={closeMobile}
      />

      {/* ── MOBILE DRAWER (slide from left) ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col
          bg-white dark:bg-neutral-800
          border-r border-neutral-200 dark:border-neutral-700
          transition-transform duration-300 ease-in-out
          md:hidden
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent
          mobile={true}
          pathname={pathname}
          isCollapsed={false}
          toggleSidebar={toggleSidebar}
          closeMobile={closeMobile}
        />
      </aside>
    </>
  );
}
