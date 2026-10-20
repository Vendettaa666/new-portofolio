"use client";

// components/ui/CVDownload.tsx
// Membuka popup berisi CV yang sudah dirender dengan warna theme aktif,
// lalu langsung trigger print-to-PDF di browser.

import { listProyek, listSertifikat } from "@/lib/data";

// Data profil statis — sesuaikan di sini
const PROFILE = {
  name: "Leo Satria Anugrah",
  title: "Web Developer",
  location: "Lumajang, Jawa Timur, Indonesia",
  email: "leoarkas81@gmail.com",
  website: "leoosatria.my.id",
  github: "github.com/vendettaa666",
  phone: "+62 xxx-xxxx-xxxx",
  bio: "Pengembang web yang antusias dengan Next.js, Laravel, dan teknologi modern. Terbiasa membangun aplikasi web full-stack dan mengintegrasikan LLM ke dalam antarmuka pengguna yang responsif. Selalu terbuka untuk kolaborasi dan tantangan baru.",
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Laravel",
    "Tailwind CSS",
    "Node.js",
    "REST API",
    "MySQL",
    "PostgreSQL",
    "Git / GitHub",
  ],
  education: {
    school: "SMKN 1 Lumajang",
    major: "Rekayasa Perangkat Lunak",
    year: "2022 – 2025",
  },
  experience: [
    {
      role: "Freelance Web Developer",
      company: "Self-Employed",
      period: "2022 – Sekarang",
      desc: "Membangun website & aplikasi web untuk klien lokal menggunakan Next.js dan Laravel. Fokus pada performa, SEO, UX, dan implementasi desain responsif.",
    },
    {
      role: "Frontend Developer (PKL)",
      company: "CV Nusantara Tama",
      period: "Jul – Des 2024",
      desc: "Praktek Kerja Lapangan. Mengembangkan antarmuka untuk sistem internal perusahaan menggunakan Laravel dan Tailwind CSS.",
    },
  ],
  languages: [
    { lang: "Indonesia", level: "Native" },
    { lang: "English", level: "Professional" },
  ],
  stats: {
    projects: listProyek.length,
    experience: "2+ Tahun",
    certs: listSertifikat.length,
  },
};

// Ambil 4 proyek untuk ditampilkan di CV (yang pinned duluan)
const FEATURED_PROJECTS = [
  ...listProyek.filter((p) => p.pinned),
  ...listProyek.filter((p) => !p.pinned),
].slice(0, 4);

/**
 * Mengambil warna primary aktif dari CSS variable --theme-primary di root.
 * Fallback ke emerald jika tidak ada.
 */
function getPrimaryColor(): string {
  if (typeof window === "undefined") return "#10b981";
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue("--theme-primary")
    .trim();
  return val || "#10b981";
}

/**
 * Mendeteksi apakah user sedang di dark mode.
 */
function isDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/**
 * Generate string HTML untuk CV A4 berdasarkan warna primary & mode.
 */
function generateCVHTML(primary: string, dark: boolean): string {
  // Derive lighter/darker shades dari primary
  // Untuk simplisitas kita pakai opacity trick di CSS
  const bg = dark ? "#141414" : "#ffffff";
  const surface = dark ? "#1c1c1c" : "#f8f8f8";
  const border = dark ? "#2a2a2a" : "#e5e5e5";
  const text = dark ? "#f2f2f2" : "#111111";
  const textMuted = dark ? "#a0a0a0" : "#6b6b6b";
  const textSubtle = dark ? "#707070" : "#9a9a9a";
  const sidebarBg = dark ? "#191919" : "#f0f0f0";
  const sidebarBorder = dark ? "#2a2a2a" : "#dcdcdc";
  const cardBg = dark ? "#181818" : "#ffffff";

  // Warna primary dengan opacity (untuk badge, tag, dsb)
  // Kita pakai filter trick di CSS via hex opacity
  const primaryHex = primary.replace("#", "");
  const r = parseInt(primaryHex.slice(0, 2), 16);
  const g = parseInt(primaryHex.slice(2, 4), 16);
  const b = parseInt(primaryHex.slice(4, 6), 16);
  const primaryBg = `rgba(${r},${g},${b},0.12)`;
  const primaryBorder = `rgba(${r},${g},${b},0.3)`;
  const primaryText = `rgba(${r},${g},${b},0.9)`;

  const skills = PROFILE.skills
    .map(
      (s) => `
    <span style="display:inline-flex;align-items:center;border:1px solid ${border};
      background:${surface};border-radius:8px;padding:3px 9px;font-size:10px;
      color:${text};margin:0 4px 4px 0;">
      ${s}
    </span>`,
    )
    .join("");

  const experience = PROFILE.experience
    .map(
      (e) => `
    <div style="border:1px solid ${border};border-radius:12px;background:${cardBg};
      padding:10px 14px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <span style="font-weight:700;font-size:12px;color:${text}">${e.role}</span>
        <span style="font-family:monospace;font-size:9px;color:${textMuted}">${e.period}</span>
      </div>
      <div style="color:${primary};font-size:10.5px;margin-top:1px;">${e.company}</div>
      <div style="margin-top:5px;color:${textMuted};font-size:10px;line-height:1.55;">${e.desc}</div>
    </div>`,
    )
    .join("");

  const projects = FEATURED_PROJECTS.map((p) => {
    const tools = p.tools.slice(0, 3).join(", ");
    return `
    <div style="flex:1 1 46%;border:1px solid ${border};border-radius:12px;background:${cardBg};
      padding:10px 12px;min-width:0;">
      <div style="display:inline-block;font-family:monospace;font-size:7.5px;
        color:${primary};background:${primaryBg};border:1px solid ${primaryBorder};
        padding:1px 7px;border-radius:99px;margin-bottom:5px;">
        ${p.role.toUpperCase()}
      </div>
      <div style="font-weight:700;font-size:11px;color:${text};margin-bottom:2px;">
        ${p.nama}
      </div>
      <div style="color:${textMuted};font-size:9.5px;line-height:1.4;margin-bottom:4px;">
        ${p.desk}
      </div>
      <div style="font-family:monospace;font-size:8.5px;color:${textSubtle};">${tools}</div>
    </div>`;
  }).join("");

  const certLines = listSertifikat
    .map(
      (c) => `
    <div style="display:flex;justify-content:space-between;align-items:baseline;
      padding:4px 0;border-bottom:1px solid ${border};">
      <span style="font-size:10.5px;color:${text}">${c.judul} · ${c.penerbit}</span>
      <span style="font-family:monospace;font-size:9px;color:${textMuted}">${c.tanggal}</span>
    </div>`,
    )
    .join("");

  const languages = PROFILE.languages
    .map(
      (l) => `
    <div style="display:flex;justify-content:space-between;color:${text};font-size:10.5px;padding:2px 0;">
      <span>${l.lang}</span>
      <span style="color:${textMuted}">${l.level}</span>
    </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>CV – Leo Satria Anugrah</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 210mm; min-height: 297mm; background: ${bg}; }
    body {
      font-family: 'Plus Jakarta Sans', Arial, sans-serif;
      font-size: 11px;
      color: ${text};
      line-height: 1.55;
    }
    /* ── Layout ── */
    .page {
      width: 210mm;
      min-height: 297mm;
      display: flex;
      background: ${bg};
    }
    .sidebar {
      width: 64mm;
      min-height: 297mm;
      background: ${sidebarBg};
      border-right: 1px solid ${sidebarBorder};
      padding: 28px 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .main {
      flex: 1;
      padding: 28px 24px 20px 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    /* ── Section header ── */
    .sec-title {
      display: flex;
      align-items: center;
      gap: 7px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      letter-spacing: 1.5px;
      color: ${textMuted};
      margin-bottom: 8px;
    }
    .sec-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: ${border};
    }
    /* ── Print settings ── */
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      html, body { width: 210mm; height: 297mm; }
      .page { page-break-after: avoid; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- ═══════════════ SIDEBAR ═══════════════ -->
  <div class="sidebar">

    <!-- Avatar + name -->
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;">
      <div style="position:relative;width:88px;height:88px;border-radius:18px;overflow:hidden;
        border:2px solid ${border};box-shadow:0 4px 16px rgba(0,0,0,.25);">
        <img src="https://leoosatria.my.id/assets/profile.png"
             onerror="this.style.display='none'"
             alt="Leo" style="width:100%;height:100%;object-fit:cover;">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;
          font-family:monospace;font-size:9px;color:${textMuted};background:${surface};">
          LEO
        </div>
      </div>
      <!-- Open badge -->
      <div style="background:${primaryBg};border:1px solid ${primaryBorder};color:${primary};
        font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 9px;
        border-radius:99px;display:inline-flex;align-items:center;gap:5px;">
        <span style="width:5px;height:5px;border-radius:50%;background:${primary};display:inline-block;"></span>
        OPEN TO WORK
      </div>
      <div style="font-size:15px;font-weight:800;line-height:1.2;color:${text};">
        ${PROFILE.name}
      </div>
      <div style="color:${textMuted};font-size:10px;">
        <span style="color:${primary}">•</span> ${PROFILE.title} <span style="color:${primary}">•</span>
      </div>
    </div>

    <!-- Kontak -->
    <div>
      <div class="sec-title">KONTAK</div>
      <div style="display:flex;flex-direction:column;gap:6px;color:${text};font-size:10px;">
        <div>📍 ${PROFILE.location}</div>
        <div>🌐 ${PROFILE.website}</div>
        <div>✉️ ${PROFILE.email}</div>
        <div>💻 ${PROFILE.github}</div>
      </div>
    </div>

    <!-- Keahlian -->
    <div>
      <div class="sec-title">KEAHLIAN</div>
      <div style="display:flex;flex-wrap:wrap;">${skills}</div>
    </div>

    <!-- Pendidikan -->
    <div>
      <div class="sec-title">PENDIDIKAN</div>
      <div style="font-weight:600;font-size:10.5px;color:${text};">
        ${PROFILE.education.school}
      </div>
      <div style="color:${textMuted};font-size:9.5px;margin-top:2px;">
        ${PROFILE.education.major} · ${PROFILE.education.year}
      </div>
    </div>

    <!-- Bahasa -->
    <div>
      <div class="sec-title">BAHASA</div>
      ${languages}
    </div>

    <!-- Footer -->
    <div style="margin-top:auto;color:${textSubtle};font-family:'JetBrains Mono',monospace;
      font-size:8px;border-top:1px solid ${border};padding-top:8px;">
      © 2025 Leo Satria Anugrah
    </div>
  </div>

  <!-- ═══════════════ MAIN ═══════════════ -->
  <div class="main">

    <!-- Top bar -->
    <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;
      font-size:8px;letter-spacing:1.2px;color:${textMuted};">
      <span style="display:flex;align-items:center;gap:6px;">
        <span style="width:5px;height:5px;border-radius:50%;background:${primary};display:inline-block;"></span>
        VENDETTA666 WORKSPACE
      </span>
      <span>LUMAJANG, ID · GMT+7</span>
    </div>

    <!-- Hero -->
    <div style="border:1px solid ${border};border-radius:16px;padding:18px 20px 16px;
      background:${cardBg};">
      <div style="display:inline-flex;align-items:center;gap:6px;
        background:${primaryBg};border:1px solid ${primaryBorder};color:${primary};
        font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 9px;border-radius:99px;">
        <span style="width:4px;height:4px;border-radius:50%;background:${primary};display:inline-block;"></span>
        OPEN TO WORK
      </div>
      <div style="margin-top:10px;color:${textMuted};font-size:10px;">Halo, saya</div>
      <div style="font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1.15;color:${text};">
        ${PROFILE.name}
      </div>
      <div style="margin-top:8px;color:${textMuted};font-size:10.5px;line-height:1.6;">
        ${PROFILE.bio}
      </div>
      <div style="margin-top:10px;display:flex;gap:7px;flex-wrap:wrap;">
        <div style="background:${primary};color:#fff;font-weight:700;font-size:9.5px;
          padding:5px 12px;border-radius:8px;">
          ${PROFILE.website}
        </div>
        <div style="border:1px solid ${primaryBorder};color:${primaryText};font-size:9.5px;
          padding:5px 12px;border-radius:8px;">
          Onsite / Remote
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div style="display:flex;gap:8px;">
      ${[
        { label: "PROYEK", value: PROFILE.stats.projects, sub: "Proyek selesai" },
        { label: "PENGALAMAN", value: PROFILE.stats.experience, sub: "Kerja profesional" },
        { label: "SERTIFIKASI", value: PROFILE.stats.certs, sub: "Sertifikat" },
      ]
        .map(
          (s) => `
      <div style="flex:1;border:1px solid ${border};border-radius:12px;background:${cardBg};
        padding:10px 8px;text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:1.2px;
          color:${primary};">${s.label}</div>
        <div style="font-size:20px;font-weight:800;line-height:1.2;color:${text};">${s.value}</div>
        <div style="color:${textMuted};font-size:9px;">${s.sub}</div>
      </div>`,
        )
        .join("")}
    </div>

    <!-- Pengalaman -->
    <div>
      <div class="sec-title">
        <span style="color:${primary};">&gt;</span> PENGALAMAN KERJA
      </div>
      ${experience}
    </div>

    <!-- Proyek -->
    <div>
      <div class="sec-title">
        <span style="color:${primary};">&gt;</span> PROYEK UNGGULAN
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${projects}
      </div>
    </div>

    <!-- Sertifikasi -->
    <div>
      <div class="sec-title">
        <span style="color:${primary};">&gt;</span> SERTIFIKASI
      </div>
      ${certLines || `<div style="color:${textMuted};font-size:10px;">–</div>`}
    </div>

  </div>
</div>
</body>
</html>`;
}

/**
 * Fungsi utama: buka popup CV lalu print ke PDF.
 * Dipanggil dari tombol Download di Sidebar.
 */
export function downloadCVAsPDF() {
  const primary = getPrimaryColor();
  const dark = isDarkMode();
  const html = generateCVHTML(primary, dark);

  const popup = window.open("", "_blank", "width=900,height=700,scrollbars=yes");
  if (!popup) {
    alert("Popup diblokir oleh browser. Izinkan popup untuk domain ini.");
    return;
  }

  popup.document.open();
  popup.document.write(html);
  popup.document.close();

  // Tunggu fonts/images load, lalu print
  popup.onload = () => {
    setTimeout(() => {
      popup.focus();
      popup.print();
      // Tutup popup setelah dialog print selesai/dibatalkan
      popup.onafterprint = () => popup.close();
      // Fallback — tutup jika onafterprint tidak tersedia
      setTimeout(() => {
        try { popup.close(); } catch {}
      }, 60_000);
    }, 600);
  };
}
