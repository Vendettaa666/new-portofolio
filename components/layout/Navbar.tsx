"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const pageName = pathname === "/" ? "Dashboard" : pathname.replace("/", "");
  const formattedTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl transition-colors duration-200
      border-b border-neutral-200 dark:border-neutral-800
      bg-white/80 dark:bg-[#0a0a0a]/80">
      <div className="flex h-16 items-center justify-between px-6 md:px-8">

        {/* KIRI: Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center text-sm font-medium">
            <span className="text-neutral-500 dark:text-neutral-400">Portfolio</span>
            <span className="mx-2 text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">{formattedTitle}</span>
          </div>
        </div>

        {/* KANAN: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full transition-all duration-200
            bg-neutral-200 dark:bg-neutral-800
            border border-neutral-300 dark:border-neutral-700
            hover:border-neutral-400 dark:hover:border-neutral-600
            cursor-pointer">
          </div>
        </div>
      </div>
    </nav>
  );
}