"use client";

import { useEffect, useState, useRef } from "react";
import { Palette } from "lucide-react";

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
    const colorObj = colors.find(c => c.value === savedColor);
    if (colorObj) {
      document.documentElement.style.setProperty('--theme-primary', colorObj.hex);
    }
  }, []);

  // 1. PERBAIKAN: Tambahkan `touchstart` agar layar sentuh (mobile) langsung merespons
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  if (!mounted) return null;

  const handleColorChange = (colorValue: string) => {
    setActiveColor(colorValue);
    localStorage.setItem("primary-color", colorValue);
    const colorObj = colors.find(c => c.value === colorValue);
    if (colorObj) {
      document.documentElement.style.setProperty('--theme-primary', colorObj.hex);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Utama (Icon Palette) */}
      <button
        type="button" // Biasakan tambah type button agar tidak error di beberapa browser
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 focus:outline-none"
        title="Ganti Tema Warna"
      >
        <Palette size={20} />
      </button>

     {/* Dropdown Menu */}
      <div
        // PERBAIKAN: Mengganti 'flex' menjadi 'grid grid-cols-3' agar menyusun ke bawah
        className={`absolute top-full mt-2 left-0 sm:left-auto sm:right-0 z-[100] p-3 
        grid grid-cols-3 gap-2.5 w-max
        bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 
        rounded-xl shadow-xl backdrop-blur-md transition-all duration-200 origin-top-left sm:origin-top-right
        ${isOpen ? "opacity-100 scale-100 visible pointer-events-auto" : "opacity-0 scale-95 invisible pointer-events-none"}`}
      >
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => handleColorChange(color.value)}
            title={color.name}
            className={`w-6 h-6 rounded-full transition-transform duration-200 active:scale-90 sm:hover:scale-110 flex items-center justify-center outline-none
              ${activeColor === color.value 
                ? "ring-2 ring-offset-2 ring-neutral-400 dark:ring-neutral-500 ring-offset-white dark:ring-offset-neutral-900 scale-110 sm:scale-110" 
                : "opacity-60 hover:opacity-100"
              }`}
            style={{ backgroundColor: color.hex }}
          >
            {activeColor === color.value && (
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}