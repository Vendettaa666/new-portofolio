"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Github } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const pageName = pathname === "/" ? "Dashboard" : pathname.replace("/", "");
  const formattedTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    // HAPUS 'fixed' ganti dengan 'sticky'
    // HAPUS padding kiri manual jika ada
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6 md:px-8"> 
        {/* px-6 atau px-8 memberikan jarak nafas agar tulisan tidak mepet kiri */}

        {/* KIRI: Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-neutral-400">
            <Menu size={24} />
          </button>

          <div className="flex items-center text-sm font-medium">
            <span className="text-neutral-500">Portfolio</span>
            <span className="mx-2 text-neutral-700">/</span>
            <span className="text-white font-semibold">{formattedTitle}</span>
          </div>
        </div>

        {/* KANAN: Actions */}
        <div className="flex items-center gap-4">
            {/* Contoh konten kanan */}
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700"></div>
        </div>
      </div>
    </nav>
  );
}