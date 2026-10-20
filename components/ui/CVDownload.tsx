"use client";

// components/ui/CVDownload.tsx
// Render CV ke hidden div → html2canvas → jsPDF → auto-download .pdf
// Warna mengikuti --theme-primary aktif (ColorSwitcher) + dark/light mode.

import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { listProyek, listSertifikat } from "@/lib/data";

/* ─── Profil & Data ───────────────────────────────────────────────────── */

const PROFILE = {
  name: "Leo Satria Anugrah",
  title: "Web Developer",
  location: "Lumajang, Jawa Timur, ID",
  email: "leoarkas81@gmail.com",
  website: "leoosatria.my.id",
  github: "github.com/vendettaa666",
  bio: "Pengembang web yang antusias dengan Next.js, Laravel, dan teknologi modern. Terbiasa membangun aplikasi full-stack dan mengintegrasikan LLM ke antarmuka responsif. Selalu terbuka untuk kolaborasi dan tantangan baru.",
  skills: [
    "Next.js","React","TypeScript","Laravel",
    "Tailwind CSS","Node.js","REST API",
    "MySQL","PostgreSQL","Git / GitHub",
  ],
  education: { school: "SMKN 1 Lumajang", major: "Rekayasa Perangkat Lunak", year: "2022–2025" },
  experience: [
    {
      role: "Freelance Web Developer",
      company: "Self-Employed",
      period: "2022 – Sekarang",
      desc: "Membangun website & aplikasi web untuk klien lokal menggunakan Next.js dan Laravel. Fokus pada performa, SEO, UX, dan desain responsif.",
    },
    {
      role: "Frontend Developer (PKL)",
      company: "CV Nusantara Tama",
      period: "Jul – Des 2024",
      desc: "Mengembangkan antarmuka sistem internal menggunakan Laravel dan Tailwind CSS.",
    },
  ],
  languages: [
    { lang: "Indonesia", level: "Native" },
    { lang: "English", level: "Professional" },
  ],
};

const FEATURED = [
  ...listProyek.filter((p) => p.pinned),
  ...listProyek.filter((p) => !p.pinned),
].slice(0, 4);

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function getPrimary(): string {
  if (typeof window === "undefined") return "#10b981";
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-primary")
      .trim() || "#10b981"
  );
}

function isDark(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/* ─── CV React Component ─────────────────────────────────────────────── */

interface CVProps {
  primary: string;
  dark: boolean;
}

function CVTemplate({ primary, dark }: CVProps) {
  const { r, g, b } = hexToRgb(primary);

  // Palette
  const bg        = dark ? "#141414" : "#ffffff";
  const surface   = dark ? "#1c1c1c" : "#f5f5f5";
  const border    = dark ? "#2e2e2e" : "#e5e5e5";
  const text      = dark ? "#f0f0f0" : "#111111";
  const muted     = dark ? "#9a9a9a" : "#6b6b6b";
  const subtle    = dark ? "#666666" : "#a0a0a0";
  const sidebarBg = dark ? "#191919" : "#f0f0f0";
  const card      = dark ? "#1a1a1a" : "#ffffff";
  const primBg    = `rgba(${r},${g},${b},0.12)`;
  const primBdr   = `rgba(${r},${g},${b},0.3)`;

  const secTitle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 8,
    letterSpacing: "1.4px",
    color: muted,
    marginBottom: 8,
    textTransform: "uppercase" as const,
  };
  const secLine: React.CSSProperties = {
    flex: 1,
    height: 1,
    background: border,
  };
  const cardBox: React.CSSProperties = {
    border: `1px solid ${border}`,
    borderRadius: 12,
    background: card,
    padding: "10px 14px",
    marginBottom: 8,
  };

  return (
    <div
      id="cv-root"
      style={{
        width: 794,
        minHeight: 1123,
        display: "flex",
        fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
        fontSize: 11,
        color: text,
        lineHeight: 1.55,
        background: bg,
      }}
    >
      {/* ── SIDEBAR ── */}
      <div
        style={{
          width: 240,
          minHeight: 1123,
          background: sidebarBg,
          borderRight: `1px solid ${border}`,
          padding: "28px 18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
          <div style={{ position: "relative", width: 96, height: 96 }}>
            <div style={{ width: 96, height: 96, borderRadius: 18, overflow: "hidden", border: `2px solid ${border}`, boxShadow: "0 4px 16px rgba(0,0,0,.25)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/profile.png"
                alt="Leo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                crossOrigin="anonymous"
              />
            </div>
          </div>
          {/* Open badge */}
          <div style={{ background: primBg, border: `1px solid ${primBdr}`, color: primary, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, padding: "2px 10px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: primary, display: "inline-block" }} />
            OPEN TO WORK
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2, color: text }}>{PROFILE.name}</div>
          <div style={{ color: muted, fontSize: 10 }}>
            <span style={{ color: primary }}>•</span> {PROFILE.title} <span style={{ color: primary }}>•</span>
          </div>
        </div>

        {/* Kontak */}
        <div>
          <div style={secTitle}>KONTAK<span style={secLine} /></div>
          {[
            { icon: "📍", val: PROFILE.location },
            { icon: "🌐", val: PROFILE.website },
            { icon: "✉️", val: PROFILE.email },
            { icon: "💻", val: PROFILE.github },
          ].map((c) => (
            <div key={c.val} style={{ display: "flex", gap: 6, alignItems: "flex-start", color: text, fontSize: 9.5, marginBottom: 5 }}>
              <span>{c.icon}</span>
              <span>{c.val}</span>
            </div>
          ))}
        </div>

        {/* Keahlian */}
        <div>
          <div style={secTitle}>KEAHLIAN<span style={secLine} /></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {PROFILE.skills.map((s) => (
              <span key={s} style={{ border: `1px solid ${border}`, background: surface, borderRadius: 7, padding: "2px 8px", fontSize: 9.5, color: text }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Pendidikan */}
        <div>
          <div style={secTitle}>PENDIDIKAN<span style={secLine} /></div>
          <div style={{ fontWeight: 600, fontSize: 10.5, color: text }}>{PROFILE.education.school}</div>
          <div style={{ color: muted, fontSize: 9.5, marginTop: 2 }}>
            {PROFILE.education.major} · {PROFILE.education.year}
          </div>
        </div>

        {/* Bahasa */}
        <div>
          <div style={secTitle}>BAHASA<span style={secLine} /></div>
          {PROFILE.languages.map((l) => (
            <div key={l.lang} style={{ display: "flex", justifyContent: "space-between", color: text, fontSize: 10, padding: "2px 0" }}>
              <span>{l.lang}</span>
              <span style={{ color: muted }}>{l.level}</span>
            </div>
          ))}
        </div>

        {/* Footer sidebar */}
        <div style={{ marginTop: "auto", color: subtle, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, borderTop: `1px solid ${border}`, paddingTop: 8 }}>
          © 2025 Leo Satria Anugrah
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, padding: "28px 24px 20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Topbar */}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: "1.2px", color: muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: primary, display: "inline-block" }} />
            VENDETTA666 WORKSPACE
          </span>
          <span>LUMAJANG, ID · GMT+7</span>
        </div>

        {/* Hero */}
        <div style={{ border: `1px solid ${border}`, borderRadius: 16, padding: "18px 20px 16px", background: card }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: primBg, border: `1px solid ${primBdr}`, color: primary, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, padding: "2px 9px", borderRadius: 99 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: primary, display: "inline-block" }} />
            OPEN TO WORK
          </div>
          <div style={{ marginTop: 10, color: muted, fontSize: 10 }}>Halo, saya</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.15, color: text }}>{PROFILE.name}</div>
          <div style={{ marginTop: 8, color: muted, fontSize: 10.5, lineHeight: 1.6 }}>{PROFILE.bio}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 7, flexWrap: "wrap" }}>
            <div style={{ background: primary, color: "#fff", fontWeight: 700, fontSize: 9.5, padding: "5px 12px", borderRadius: 8 }}>{PROFILE.website}</div>
            <div style={{ border: `1px solid ${primBdr}`, color: primary, fontSize: 9.5, padding: "5px 12px", borderRadius: 8 }}>Onsite / Remote</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "PROYEK", value: listProyek.length, sub: "Proyek selesai" },
            { label: "PENGALAMAN", value: "2+ Tahun", sub: "Kerja profesional" },
            { label: "SERTIFIKASI", value: listSertifikat.length, sub: "Sertifikat" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, border: `1px solid ${border}`, borderRadius: 12, background: card, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7.5, letterSpacing: "1.2px", color: primary }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, color: text }}>{s.value}</div>
              <div style={{ color: muted, fontSize: 9 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Pengalaman */}
        <div>
          <div style={secTitle}><span style={{ color: primary }}>&gt;</span> PENGALAMAN KERJA<span style={secLine} /></div>
          {PROFILE.experience.map((e) => (
            <div key={e.role} style={cardBox}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: text }}>{e.role}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, color: muted }}>{e.period}</span>
              </div>
              <div style={{ color: primary, fontSize: 10 }}>{e.company}</div>
              <div style={{ marginTop: 4, color: muted, fontSize: 9.5, lineHeight: 1.55 }}>{e.desc}</div>
            </div>
          ))}
        </div>

        {/* Proyek */}
        <div>
          <div style={secTitle}><span style={{ color: primary }}>&gt;</span> PROYEK UNGGULAN<span style={secLine} /></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FEATURED.map((p) => (
              <div key={p.id} style={{ flex: "1 1 46%", border: `1px solid ${border}`, borderRadius: 12, background: card, padding: "10px 12px" }}>
                <div style={{ display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 7.5, color: primary, background: primBg, border: `1px solid ${primBdr}`, padding: "1px 7px", borderRadius: 99, marginBottom: 5 }}>
                  {p.role.toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: 11, color: text, marginBottom: 2 }}>{p.nama}</div>
                <div style={{ color: muted, fontSize: 9.5, lineHeight: 1.4, marginBottom: 4 }}>{p.desk}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, color: subtle }}>
                  {p.tools.slice(0, 3).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sertifikasi */}
        <div>
          <div style={secTitle}><span style={{ color: primary }}>&gt;</span> SERTIFIKASI<span style={secLine} /></div>
          {listSertifikat.length === 0 ? (
            <div style={{ color: muted, fontSize: 10 }}>–</div>
          ) : (
            listSertifikat.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "4px 0", borderBottom: `1px solid ${border}` }}>
                <span style={{ fontSize: 10, color: text }}>{c.judul} · {c.penerbit}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, color: muted }}>{c.tanggal}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

/* ─── Download Function ───────────────────────────────────────────────── */

export async function downloadCVAsPDF(): Promise<void> {
  // Dynamic import — tidak diload saat SSR / halaman pertama kali
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const primary = getPrimary();
  const dark = isDark();

  // Buat container tersembunyi di body
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:794px;z-index:-1;";
  document.body.appendChild(container);

  // Mount React component ke container
  await new Promise<void>((resolve) => {
    const root = createRoot(container);
    root.render(<CVTemplate primary={primary} dark={dark} />);
    // Beri waktu React + font untuk render
    setTimeout(resolve, 800);
  });

  const cvEl = container.querySelector("#cv-root") as HTMLElement;

  try {
    const canvas = await html2canvas(cvEl, {
      scale: 2,                // resolusi 2x → tajam di A4
      useCORS: true,
      allowTaint: false,
      backgroundColor: dark ? "#141414" : "#ffffff",
      logging: false,
      width: 794,
      height: 1123,
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 dalam mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfW = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfH = pdf.internal.pageSize.getHeight();  // 297mm

    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save("CV-Leo-Satria-Anugrah.pdf");
  } finally {
    // Unmount & bersihkan
    document.body.removeChild(container);
  }
}

/* ─── Button Component (opsional — bisa dipakai langsung) ─────────────── */
export default function CVDownloadButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await downloadCVAsPDF();
    } catch (e) {
      console.error("CV download failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handle} disabled={loading} className={className}>
      {loading ? "Generating PDF…" : "Download CV"}
    </button>
  );
}
