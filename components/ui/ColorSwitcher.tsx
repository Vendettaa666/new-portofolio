"use client";

import { useEffect, useState, useRef } from "react";
import { Palette } from "lucide-react"; // Import icon palet warna

const colors = [
  { name: "Emerald", value: "emerald", hex: "#10b981" },
  { name: "Blue", value: "blue", hex: "#3b82f6" },
  { name: "Violet", value: "violet", hex: "#8b5cf6" },
  { name: "Rose", value: "rose", hex: "#f43f5e" },
  { name: "Amber", value: "amber", hex: "#f59e0b" },
];

export default function ColorSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [activeColor, setActiveColor] = useState("emerald");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedColor = localStorage.getItem("primary-color") || "emerald";
    setActiveColor(savedColor);
    document.documentElement.setAttribute("data-primary", savedColor);
  }, []);

  // Fungsi untuk menutup dropdown kalau user klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const handleColorChange = (colorValue: string) => {
    setActiveColor(colorValue);
    localStorage.setItem("primary-color", colorValue);
    document.documentElement.setAttribute("data-primary", colorValue);
    setIsOpen(false); // Otomatis tutup dropdown setelah milih warna
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Utama (Icon Palette) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
        title="Ganti Tema Warna"
      >
        <Palette size={20} />
      </button>

      {/* Dropdown Menu (Muncul saat isOpen == true) */}
      <div
        className={`absolute bottom-full mb-2 left-0 sm:bottom-auto sm:top-full sm:mt-2 sm:left-auto sm:right-0 z-50 p-3 flex gap-2 
        bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 
        rounded-2xl shadow-xl backdrop-blur-md transition-all duration-200 origin-bottom-left sm:origin-top-right
        ${isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
      >
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => handleColorChange(color.value)}
            title={color.name}
            className={`w-6 h-6 rounded-full transition-transform duration-200 hover:scale-110 flex items-center justify-center
              ${activeColor === color.value 
                ? "ring-2 ring-offset-2 ring-neutral-400 dark:ring-neutral-500 ring-offset-white dark:ring-offset-neutral-900 scale-110" 
                : "opacity-60 hover:opacity-100"
              }`}
            style={{ backgroundColor: color.hex }}
          >
            {/* Titik putih kecil di tengah warna yang sedang aktif */}
            {activeColor === color.value && (
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}