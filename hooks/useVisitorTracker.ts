// hooks/useVisitorTracker.ts
// Panggil di layout.tsx atau page utama untuk merekam kunjungan
// Hanya POST sekali per sesi (pakai sessionStorage)

"use client";

import { useEffect } from "react";

export function useVisitorTracker() {
  useEffect(() => {
    // Sudah dicatat di sesi ini? Skip
    if (sessionStorage.getItem("vt_tracked")) return;

    fetch("/api/visitors", { method: "POST" })
      .then(() => sessionStorage.setItem("vt_tracked", "1"))
      .catch(() => {}); // silent fail
  }, []);
}