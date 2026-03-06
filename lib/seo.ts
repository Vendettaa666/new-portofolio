// lib/seo.ts
import { Metadata } from "next";

// ── KONFIGURASI UTAMA ──────────────────────────────────────────────────────
export const siteConfig = {
  name: "Leo Satria",
  title: "Leo Satria | Full-Stack Developer Portfolio",
  description:
    "Portfolio Leo Satria – Siswa SMKN 1 Lumajang jurusan Rekayasa Perangkat Lunak. Full-Stack Developer yang fokus di React, Next.js, Laravel, dan desain UI modern. Lihat projek, skill, dan cara menghubungi saya.",
  url: "https://leoosatria.my.id", // GANTI dengan domain kamu
  googleVerification: "GdlvQh4VoPEHz3NtCe7Tdan1T0bX3M6f_qY6yeEQe3k",
  ogImage: "/og-image.png", // Ukuran: 1200x630px
  links: {
    twitter: "https://twitter.com/your_twitter",
    github: "https://github.com/vendettaa666",
    linkedin: "https://linkedin.com/in/leo-satria-anugrah-12a698373",
    email: "mailto:leoarkas81@gmail.com",
  },
  keywords: [
    "Leo Satria",
    "leo satria",
    "portfolio",
    "full stack developer",
    "frontend developer",
    "backend developer",
    "react developer",
    "next.js developer",
    "laravel developer",
    "javascript",
    "typescript",
    "tailwind css",
    "web developer Indonesia",
    "software engineer",
    "UI/UX developer",
    "SMKN 1 Lumajang",
    "rekayasa perangkat lunak",
  ],
  author: {
    name: "Leo Satria",
    url: "https://leoosatria.my.id",
  },
};

// ── METADATA GENERATOR ─────────────────────────────────────────────────────
interface PageSEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noindex?: boolean;
  keywords?: string[];
}

export function generateSEO({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  
  url = "",
  noindex = false,
  keywords = siteConfig.keywords,
}: PageSEOProps = {}): Metadata {
  const fullUrl = `${siteConfig.url}${url}`;

  return {
    title,
    description,
    keywords,
    authors: [siteConfig.author],
    creator: siteConfig.author.name,

    verification: {
      google: siteConfig.googleVerification,
    },
    
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url || "/",
    },
    
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      type: "website",
      locale: "id_ID",
      url: fullUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@", // GANTI dengan username Twitter kamu
    },
  };
}

// ── JSON-LD STRUCTURED DATA ────────────────────────────────────────────────
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/assets/profile.png`,
    jobTitle: "Full-Stack Developer",
    description: siteConfig.description,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
    ],
    knowsAbout: [
      "Web Development",
      "React",
      "Next.js",
      "Laravel",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "UI/UX Design",
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
