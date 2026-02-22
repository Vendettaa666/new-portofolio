"use client";

import {
  Home,
  User,
  Layers,
  Code,
  Mail,
  Download,
  ChevronLeft,
  ChevronRight,
  Copyright,
  X,
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
          : "mx-3 mt-4 mb-6 p-5 rounded-2xl shadow-sm bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900/40 dark:to-neutral-900/20 border border-neutral-200 dark:border-neutral-800"
          }`}
      >
        {/* Profile Image */}
        <div
          className={`relative transition-all duration-300 ${!mobile && isCollapsed ? "mb-0" : "mb-4"}`}
        >
          <div
            className={`relative rounded-full overflow-hidden border transition-all duration-300
            border-neutral-300 dark:border-neutral-700 shadow-lg
            ${!mobile && isCollapsed ? "w-10 h-10" : "w-24 h-24 ring-4 ring-neutral-200 dark:ring-neutral-900"}`}
          >
            <img
              src="/assets/profile.png"
              alt="User"
              className="w-full h-full object-cover bg-neutral-200 dark:bg-neutral-800"
            />
          </div>
          {(mobile || !isCollapsed) && (
            <div className="absolute bottom-0 right-0 bg-white dark:bg-neutral-900 p-1 rounded-full shadow-md">
              <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-[9px] font-medium text-primary leading-none">
                  Open
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Info Text & Button */}
        <div
          className={`flex flex-col items-center w-full transition-all duration-300 ${!mobile && isCollapsed
            ? "opacity-0 h-0 overflow-hidden"
            : "opacity-100 h-auto"
            }`}
        >
          <h3 className="font-semibold text-base tracking-tight text-neutral-900 dark:text-white">
            Leo Satria Anugrah
          </h3>
          <p className="text-xs mb-4 font-medium text-neutral-500 dark:text-neutral-400">
            Web Developer
          </p>

          <button
            className="group w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 text-xs font-medium shadow-sm hover:shadow-md
          bg-neutral-200 dark:bg-neutral-800  border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200  hover:bg-primary dark:hover:bg-primary hover:border-primary dark:hover:border-primary hover:text-white dark:hover:text-white"
          >
            <Download
              size={14}
              // Ikon juga ikut berubah jadi putih saat tombol di-hover
              className="text-neutral-500 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-white transition-colors"
            />
            <span>Download CV</span>
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        {(mobile || !isCollapsed) && (
          <p className="text-xs font-semibold px-4 mb-2 uppercase tracking-wider whitespace-nowrap text-neutral-400 dark:text-neutral-500">
            Menu
          </p>
        )}

        <nav className="flex flex-col gap-1.5 space-y-2 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const collapsed = !mobile && isCollapsed;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={mobile ? closeMobile : undefined}
                className={`group flex items-center relative transition-all duration-200 ${collapsed
                  ? "justify-center w-8 h-8 rounded-xl"
                  : "gap-3 px-4 py-3 w-full rounded-xl"
                  } ${isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                title={collapsed ? item.label : ""}
              >
                <item.icon
                  size={20}
                  className={`transition-colors duration-200 shrink-0 ${isActive
                    ? "text-white"
                    : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white"
                    }`}
                />
                {!collapsed && (
                  <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div
        className={`p-4 border-t border-neutral-200 dark:border-neutral-800 ${!mobile && isCollapsed ? "flex justify-center" : ""}`}
      >
        {!mobile && isCollapsed ? (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500">
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
          bg-white dark:bg-[#0a0a0a]
          border-r border-neutral-200 dark:border-neutral-800
          ${isCollapsed ? "w-20" : "w-70"}`}
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
        className={`fixed top-0 left-0 h-full w-7 2 z-50 flex flex-col
          bg-white dark:bg-[#0a0a0a]
          border-r border-neutral-200 dark:border-neutral-800
          transition-transform duration-300 ease-in-out
          md:hidden
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent
          mobile={true}
          pathname={pathname}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          closeMobile={closeMobile}
        />
      </aside>
    </>
  );
}
