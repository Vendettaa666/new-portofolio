// components/DashboardLayout.tsx
"use client"; // Wajib ada karena pakai useState

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* 1. SIDEBAR */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      {/* 2. MAIN CONTENT */}
      {/* Logic Margin: Kalau collapsed (kecil) margin kiri 20 (80px), kalau normal margin kiri 72 (288px) */}
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-72"
        }`}
      >
        <Navbar />

        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}