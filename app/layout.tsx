// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { generateSEO, generatePersonSchema, generateWebsiteSchema } from "@/lib/seo";
import StructuredData from "@/components/seo/StructuredData";

// 1. Font Default
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// 2. Font Khusus (Bento/Dashboard)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

// ── SEO METADATA ───────────────────────────────────────────────────────────
export const metadata: Metadata = generateSEO({
  title: "Leo Satria | Full-Stack Developer Portfolio",
  description:
    "Portfolio Leo Satria – Siswa SMKN 1 Lumajang jurusan Rekayasa Perangkat Lunak. Full-Stack Developer yang fokus di React, Next.js, Laravel, dan desain UI modern. Lihat projek, skill, dan cara menghubungi saya.",
});

// ── VIEWPORT CONFIGURATION ─────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <StructuredData data={personSchema} />
        <StructuredData data={websiteSchema} />
        
        {/* Preconnect untuk performa */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body 
        className={`${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable} font-sans overflow-x-hidden antialiased`}
      >
        <ThemeProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}