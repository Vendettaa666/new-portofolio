"use client";

// components/ui/CVDownload.tsx
// Render CV ke hidden div → html2canvas → jsPDF → auto-download .pdf
// Warna mengikuti --theme-primary aktif (ColorSwitcher) + dark/light mode.

import { useState } from "react";
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
    // { lang: "English", level: "Professional" },
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
  const surface   = dark ? "#222222" : "#f3f3f3";
  const border    = dark ? "#2e2e2e" : "#e2e2e2";
  const text      = dark ? "#efefef" : "#111111";
  const muted     = dark ? "#909090" : "#666666";
  const subtle    = dark ? "#606060" : "#aaaaaa";
  const sidebarBg = dark ? "#191919" : "#eeeeee";
  const card      = dark ? "#1c1c1c" : "#ffffff";
  const primBg    = `rgba(${r},${g},${b},0.13)`;
  const primBdr   = `rgba(${r},${g},${b},0.32)`;

  // Shared reusable styles
  const mono = "'JetBrains Mono', 'Courier New', monospace";
  const sans = "Arial, Helvetica, sans-serif";

  // Badge: OPEN TO WORK, role tag — pakai block + padding simetris, no flexbox
  const badge = (label: string, opts?: { small?: boolean }): React.CSSProperties => ({
    display: "inline-block",
    background: primBg,
    border: `1px solid ${primBdr}`,
    color: primary,
    fontFamily: mono,
    fontSize: opts?.small ? 7 : 7.5,
    fontWeight: 500,
    letterSpacing: "0.8px",
    padding: opts?.small ? "3px 7px 2px" : "4px 10px 3px",
    borderRadius: 99,
    textAlign: "center" as const,
    verticalAlign: "middle",
    lineHeight: "1",
  });

  // Section title row
  const secTitleWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  };
  const secTitleText: React.CSSProperties = {
    fontFamily: mono,
    fontSize: 8,
    letterSpacing: "1.4px",
    color: muted,
    textTransform: "uppercase" as const,
    lineHeight: "1",
    whiteSpace: "nowrap" as const,
  };
  const secLine: React.CSSProperties = {
    flex: 1,
    height: 1,
    background: border,
    alignSelf: "center",
  };

  const cardBox: React.CSSProperties = {
    border: `1px solid ${border}`,
    borderRadius: 10,
    background: card,
    padding: "9px 13px",
    marginBottom: 7,
  };

  return (
    <div
      id="cv-root"
      style={{
        width: 794,
        minHeight: 1123,
        display: "flex",
        fontFamily: sans,
        fontSize: 10.5,
        color: text,
        lineHeight: "1.5",
        background: bg,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ══════════ SIDEBAR ══════════ */}
      <div style={{
        width: 234,
        minHeight: 1123,
        background: sidebarBg,
        borderRight: `1px solid ${border}`,
        padding: "26px 16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}>

        {/* Avatar + name */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 90, height: 90, borderRadius: 16,
            overflow: "hidden", border: `2px solid ${border}`,
            margin: "0 auto 8px",
            boxShadow: "0 4px 14px rgba(0,0,0,.3)",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/profile.png" alt="Leo"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              crossOrigin="anonymous" />
          </div>

          {/* Open badge — block, center */}
          <div style={{ margin: "0 auto 7px", textAlign: "center" }}>
            <span style={badge("OPEN TO WORK")}>&#9679;&nbsp; OPEN TO WORK</span>
          </div>

          <div style={{ fontSize: 14.5, fontWeight: 800, color: text, lineHeight: "1.25" }}>
            {PROFILE.name}
          </div>
          <div style={{ marginTop: 3, color: muted, fontSize: 10, lineHeight: "1" }}>
            <span style={{ color: primary }}>&#8226;</span>
            {" "}{PROFILE.title}{" "}
            <span style={{ color: primary }}>&#8226;</span>
          </div>
        </div>

        {/* Kontak */}
        <div>
          <div style={secTitleWrap}>
            <span style={secTitleText}>KONTAK</span>
            <span style={secLine} />
          </div>
          {[
            { icon: ">", val: PROFILE.location },
            { icon: "@", val: PROFILE.website },
            { icon: "~", val: PROFILE.email },
            { icon: "$", val: PROFILE.github },
          ].map((c) => (
            <div key={c.val} style={{ display: "flex", gap: 5, alignItems: "flex-start", color: text, fontSize: 9, marginBottom: 5, lineHeight: "1.4" }}>
              <span style={{ color: primary, fontFamily: mono, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
              <span>{c.val}</span>
            </div>
          ))}
        </div>

        {/* Keahlian */}
        <div>
          <div style={secTitleWrap}>
            <span style={secTitleText}>KEAHLIAN</span>
            <span style={secLine} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {PROFILE.skills.map((s) => (
              <span key={s} style={{
                display: "inline-block",
                border: `1px solid ${border}`,
                background: surface,
                borderRadius: 6,
                padding: "2px 7px 1px",
                fontSize: 9,
                color: text,
                lineHeight: "1.4",
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Pendidikan */}
        <div>
          <div style={secTitleWrap}>
            <span style={secTitleText}>PENDIDIKAN</span>
            <span style={secLine} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 10, color: text, lineHeight: "1.35" }}>
            {PROFILE.education.school}
          </div>
          <div style={{ color: muted, fontSize: 9, marginTop: 2, lineHeight: "1.35" }}>
            {PROFILE.education.major} · {PROFILE.education.year}
          </div>
        </div>

        {/* Bahasa */}
        <div>
          <div style={secTitleWrap}>
            <span style={secTitleText}>BAHASA</span>
            <span style={secLine} />
          </div>
          {PROFILE.languages.map((l) => (
            <div key={l.lang} style={{
              display: "flex", justifyContent: "space-between",
              color: text, fontSize: 9.5, padding: "2px 0", lineHeight: "1.35",
            }}>
              <span>{l.lang}</span>
              <span style={{ color: muted }}>{l.level}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "auto", color: subtle,
          fontFamily: mono, fontSize: 7.5,
          borderTop: `1px solid ${border}`, paddingTop: 8,
          lineHeight: "1",
        }}>
          &#169; 2025 Leo Satria Anugrah
        </div>
      </div>

      {/* ══════════ MAIN ══════════ */}
      <div style={{ flex: 1, padding: "26px 22px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Topbar */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: mono, fontSize: 7.5,
          letterSpacing: "1.2px", color: muted, lineHeight: "1",
        }}>
          <span>&#9679; VENDETTA666 WORKSPACE</span>
          <span>LUMAJANG, ID · GMT+7</span>
        </div>

        {/* Hero */}
        <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: "16px 18px 14px", background: card }}>
          {/* badge */}
          <div><span style={badge("OPEN TO WORK")}>&#9679;&nbsp; OPEN TO WORK</span></div>

          <div style={{ marginTop: 9, color: muted, fontSize: 9.5, lineHeight: "1" }}>Halo, saya</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: "1.15", color: text, marginTop: 3 }}>
            {PROFILE.name}
          </div>
          <div style={{ marginTop: 7, color: muted, fontSize: 10, lineHeight: "1.6" }}>{PROFILE.bio}</div>

          {/* Buttons — block spans, no flex */}
          <div style={{ marginTop: 9, lineHeight: "1" }}>
            <span style={{
              display: "inline-block",
              background: primary, color: "#ffffff",
              fontWeight: 700, fontSize: 9,
              padding: "5px 13px 4px",
              borderRadius: 7, marginRight: 6,
              lineHeight: "1", verticalAlign: "middle",
            }}>
              {PROFILE.website}
            </span>
            <span style={{
              display: "inline-block",
              border: `1px solid ${primBdr}`, color: primary,
              fontSize: 9, padding: "4px 13px 3px",
              borderRadius: 7,
              lineHeight: "1", verticalAlign: "middle",
            }}>
              Onsite / Remote
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 7 }}>
          {[
            { label: "PROYEK",       value: String(listProyek.length),  sub: "Proyek selesai"   },
            { label: "PENGALAMAN",   value: "2+ Tahun",                  sub: "Kerja profesional" },
            { label: "SERTIFIKASI",  value: String(listSertifikat.length), sub: "Sertifikat"    },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1,
              border: `1px solid ${border}`, borderRadius: 10,
              background: card, padding: "9px 6px",
              textAlign: "center",
            }}>
              <div style={{ fontFamily: mono, fontSize: 7, letterSpacing: "1.1px", color: primary, lineHeight: "1", marginBottom: 5 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, color: text, lineHeight: "1", marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ color: muted, fontSize: 8.5, lineHeight: "1" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Pengalaman Kerja */}
        <div>
          <div style={secTitleWrap}>
            <span style={{ ...secTitleText, color: primary }}>&#62;</span>
            <span style={secTitleText}>PENGALAMAN KERJA</span>
            <span style={secLine} />
          </div>
          {PROFILE.experience.map((e) => (
            <div key={e.role} style={cardBox}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 11.5, color: text, lineHeight: "1.2" }}>{e.role}</span>
                <span style={{ fontFamily: mono, fontSize: 8, color: muted, lineHeight: "1" }}>{e.period}</span>
              </div>
              <div style={{ color: primary, fontSize: 9.5, marginTop: 2, lineHeight: "1" }}>{e.company}</div>
              <div style={{ marginTop: 4, color: muted, fontSize: 9, lineHeight: "1.55" }}>{e.desc}</div>
            </div>
          ))}
        </div>

        {/* Proyek Unggulan */}
        <div>
          <div style={secTitleWrap}>
            <span style={{ ...secTitleText, color: primary }}>&#62;</span>
            <span style={secTitleText}>PROYEK UNGGULAN</span>
            <span style={secLine} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {FEATURED.map((p) => (
              <div key={p.id} style={{
                flex: "1 1 46%", minWidth: 0,
                border: `1px solid ${border}`, borderRadius: 10,
                background: card, padding: "9px 11px",
              }}>
                {/* Role badge */}
                <div style={{ marginBottom: 5 }}>
                  <span style={badge(p.role.toUpperCase(), { small: true })}>
                    {p.role.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 10.5, color: text, lineHeight: "1.25", marginBottom: 2 }}>
                  {p.nama}
                </div>
                <div style={{ color: muted, fontSize: 9, lineHeight: "1.4", marginBottom: 4 }}>
                  {p.desk}
                </div>
                <div style={{ fontFamily: mono, fontSize: 8, color: subtle, lineHeight: "1" }}>
                  {p.tools.slice(0, 3).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sertifikasi */}
        <div>
          <div style={secTitleWrap}>
            <span style={{ ...secTitleText, color: primary }}>&#62;</span>
            <span style={secTitleText}>SERTIFIKASI</span>
            <span style={secLine} />
          </div>
          {listSertifikat.length === 0 ? (
            <div style={{ color: muted, fontSize: 9.5 }}>–</div>
          ) : (
            listSertifikat.map((c) => (
              <div key={c.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                padding: "4px 0", borderBottom: `1px solid ${border}`,
              }}>
                <span style={{ fontSize: 9.5, color: text, lineHeight: "1.4" }}>
                  {c.judul} · {c.penerbit}
                </span>
                <span style={{ fontFamily: mono, fontSize: 8, color: muted, lineHeight: "1" }}>
                  {c.tanggal}
                </span>
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
  const [{ default: jsPDF }] = await Promise.all([
    import("jspdf"),
  ]);

  const primary = getPrimary();
  const dark = isDark();
  const bgColor = dark ? "#141414" : "#ffffff";

  // ── Buat iframe tersembunyi dengan document bersih ──
  // Alasan: html2canvas membaca getComputedStyle dari SELURUH dokumen,
  // termasuk CSS variables oklch/lab dari Tailwind yang dia tidak support.
  // Iframe punya document terpisah → bebas dari oklch parent.
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:794px;height:1123px;border:none;visibility:hidden;";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument!;

  // Tulis HTML dasar ke iframe — hanya font Google, tanpa CSS Tailwind
  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
  crossorigin="anonymous">
<style>
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html,body{width:794px;height:1123px;background:${bgColor};overflow:hidden}
</style>
</head>
<body><div id="cv-mount"></div></body>
</html>`);
  iframeDoc.close();

  // Tunggu iframe + font siap
  await new Promise<void>((resolve) => {
    const check = () => {
      if (iframe.contentDocument?.readyState === "complete") resolve();
      else setTimeout(check, 50);
    };
    check();
  });

  // Mount React CVTemplate ke dalam iframe
  const mountEl = iframeDoc.getElementById("cv-mount")!;
  await new Promise<void>((resolve) => {
    const root = createRoot(mountEl);
    root.render(<CVTemplate primary={primary} dark={dark} />);
    // Tunggu render + font Google load
    setTimeout(resolve, 1200);
  });

  const cvEl = iframeDoc.getElementById("cv-root") as HTMLElement;

  try {
    // Import html2canvas setelah iframe siap
    const { default: html2canvas } = await import("html2canvas");

    const canvas = await html2canvas(cvEl, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: bgColor,
      logging: false,
      width: 794,
      height: 1123,
      // Penting: pakai window iframe agar getComputedStyle tidak bocor ke parent
      windowWidth: 794,
      windowHeight: 1123,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save("CV-Leo-Satria-Anugrah.pdf");
  } finally {
    document.body.removeChild(iframe);
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
