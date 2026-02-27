"use client";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import ColorSwitcher from "../ui/ColorSwitcher";

interface NavbarProps {
  openMobile: () => void;
}

export default function Navbar({ openMobile }: NavbarProps) {
  const pathname = usePathname();
  const pageName = pathname === "/" ? "Dashboard" : pathname.replace("/", "");
  const formattedTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">

        {/* KIRI: Hamburger (mobile) + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Tombol hamburger - hanya muncul di mobile */}
          <button
            onClick={openMobile}
            className="md:hidden p-2 rounded-lg transition-colors
              text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white
              hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center text-sm font-medium">
            <span className="text-neutral-600 dark:text-neutral-400">Portfolio</span>
            <span className="mx-2 text-neutral-400 dark:text-neutral-600">/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">{formattedTitle}</span>
          </div>
        </div>

        {/* KANAN: Actions */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <ColorSwitcher />
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-600">
            <img
              src="/assets/profile.png"
              alt="Leo Satria Anugrah"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}