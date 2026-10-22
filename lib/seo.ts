// lib/seo.ts
import { Metadata } from "next";

// ── KONFIGURASI UTAMA ──────────────────────────────────────────────────────
export const siteConfig = {
  name: "Leo Satria Anugrah",
  title: "Leo Satria Anugrah | Full-Stack Web Developer",
  description:
    "Portfolio Leo Satria Anugrah, Full-Stack Web Developer dan mahasiswa Teknologi Rekayasa Komputer Polije. Membangun web dengan Laravel, Next.js, dan Tailwind CSS.",
  url: "https://leoosatria.my.id",
  googleVerification: "GdlvQh4VoPEHz3NtCe7Tdan1T0bX3M6f_qY6yeEQe3k",
  ogImage: "/og-image.png", // Ukuran: 1200x630px
  links: {
    github: "https://github.com/vendettaa666",
    linkedin: "https://linkedin.com/in/leo-satria-anugrah-12a698373",
    email: "mailto:leoarkas81@gmail.com",
  },
  keywords: [
    "Leo Satria Anugrah",
    "Leo Satria",
    "portfolio",
    "full stack developer",
    "web developer",
    "frontend developer",
    "backend developer",
    "laravel developer",
    "next.js developer",
    "react developer",
    "javascript",
    "tailwind css",
    "web developer Indonesia",
    "web developer Lumajang",
    "web developer Jember",
    "Politeknik Negeri Jember",
    "Teknologi Rekayasa Komputer",
    "SMKN 1 Lumajang",
  ],
  author: {
    name: "Leo Satria Anugrah",
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
    email: "leoarkas81@gmail.com",
    jobTitle: "Full-Stack Web Developer",
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lumajang",
      addressRegion: "Jawa Timur",
      addressCountry: "ID",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "SMK Negeri 1 Lumajang",
    },
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Politeknik Negeri Jember",
    },
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    knowsAbout: [
      "Web Development",
      "Laravel",
      "Next.js",
      "React",
      "PHP",
      "JavaScript",
      "Tailwind CSS",
      "Node.js",
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
    inLanguage: "id-ID",
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