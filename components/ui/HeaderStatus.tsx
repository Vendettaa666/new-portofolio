"use client"; // Wajib ditambahkan karena kita pakai useState dan useEffect

import { useState, useEffect } from "react";

export default function HeaderStatus() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      
      // Mengambil Jam dan Menit (ditambah '0' di depan jika angkanya di bawah 10)
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      
      // Kalau kamu mau jamnya otomatis ngikutin zona waktu laptop pengunjung, 
      // kamu bisa hitung offset-nya. Tapi karena di gambarmu spesifik Kudus (WIB), 
      // kita set formatnya menjadi GMT+7.
      setTime(`${hours}:${minutes} GMT+7`);
    };

    updateTime(); // Jalankan sekali saat pertama kali di-load
    
    // Update jam setiap 1 detik (1000 ms)
    const intervalId = setInterval(updateTime, 1000); 

    // Bersihkan interval saat komponen dilepas agar tidak memory leak
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="font-jetbrains w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400 tracking-wider ">
      
      {/* BAGIAN KIRI: Workspace & Indikator Online */}
      <div className="flex items-center gap-2 uppercase">
        {/* Efek animasi titik hijau berkedip (ping) ala Tailwind */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Vendetta666 WORKSPACE
      </div>

      {/* BAGIAN KANAN: Lokasi & Jam Dinamis */}
      <div className="flex items-center gap-4 uppercase">
        <span>Lumajang, ID</span>
        {/* Titik pemisah kecil */}
        <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
        {/* Mencegah error hydration dari Next.js saat merender jam di server vs client */}
        <span>{mounted ? time : "--:-- GMT+7"}</span>
      </div>
      
    </div>
  );
}