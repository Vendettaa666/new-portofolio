# 🚀 SEO Setup Guide

Panduan lengkap untuk mengoptimalkan SEO website portfolio kamu.

---

## 📋 Checklist Setup

### 1. Update Konfigurasi di `lib/seo.ts`

```typescript
export const siteConfig = {
  name: "Leonardo",                              // ✏️ Ganti nama kamu
  title: "Leonardo | Full-Stack Developer",      // ✏️ Ganti title
  description: "...",                            // ✏️ Ganti deskripsi
  url: "https://your-domain.com",                // ✏️ WAJIB ganti domain
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/...",          // ✏️ Ganti link sosmed
    github: "https://github.com/...",
    linkedin: "https://linkedin.com/in/...",
    email: "mailto:...",
  },
  keywords: [...],                               // ✏️ Tambah keyword relevan
};
```

### 2. Buat OG Image (Open Graph)

**Ukuran:** 1200 x 630 px  
**Format:** PNG atau JPG  
**Lokasi:** `/public/og-image.png`

**Tools untuk membuat:**
- [Canva](https://canva.com) - Template "Facebook Post"
- [Figma](https://figma.com) - Buat custom design
- [OG Image Generator](https://og-image.vercel.app/)

**Tips:**
- Gunakan font besar dan jelas
- Tambahkan nama dan role kamu
- Gunakan warna brand yang konsisten
- Hindari teks terlalu kecil

### 3. Buat Favicon & Icons

**Yang dibutuhkan:**
- `favicon.ico` (32x32 atau 16x16)
- `apple-touch-icon.png` (180x180)
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

**Lokasi:** Semua di folder `/public/`

**Tools:**
- [Favicon.io](https://favicon.io/) - Generate dari text/image
- [RealFaviconGenerator](https://realfavicongenerator.net/)

### 4. Update Domain di File Berikut

Cari dan ganti `https://your-domain.com` di:
- ✅ `lib/seo.ts`
- ✅ `app/robots.ts`
- ✅ `app/sitemap.ts`

### 5. Update Twitter Username

Cari dan ganti `@your_twitter` di:
- ✅ `lib/seo.ts` (line 60)

---

## 📄 File-File SEO yang Sudah Dibuat

### 1. `lib/seo.ts`
Konfigurasi utama SEO dan helper functions.

**Fungsi:**
- `generateSEO()` - Generate metadata untuk setiap page
- `generatePersonSchema()` - Schema.org untuk profil
- `generateWebsiteSchema()` - Schema.org untuk website
- `generateBreadcrumbSchema()` - Schema.org untuk breadcrumb

### 2. `app/robots.ts`
Memberitahu search engine crawler halaman mana yang boleh diindex.

### 3. `app/sitemap.ts`
Daftar semua halaman website untuk search engine.

### 4. `app/manifest.ts`
Konfigurasi PWA (Progressive Web App).

### 5. `components/seo/StructuredData.tsx`
Komponen untuk inject JSON-LD structured data.

---

## 🎯 Cara Menggunakan SEO di Halaman Lain

### Contoh: Update SEO di `/about`

```typescript
// app/about/page.tsx
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "About Me | Leonardo",
  description: "Kenali lebih dekat tentang Leonardo, perjalanan karir, skill, dan pengalaman sebagai Full-Stack Developer.",
  url: "/about",
});

export default function AboutPage() {
  // ... component code
}
```

### Contoh: Update SEO di `/projects`

```typescript
// app/projects/page.tsx
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Projects | Leonardo",
  description: "Lihat koleksi project web development yang telah saya kerjakan menggunakan React, Next.js, Laravel, dan teknologi modern lainnya.",
  url: "/projects",
  keywords: ["web projects", "portfolio projects", "react projects", "next.js projects"],
});

export default function ProjectsPage() {
  // ... component code
}
```

---

## 🔍 Testing SEO

### 1. Google Search Console
- Daftar di [Google Search Console](https://search.google.com/search-console)
- Verify ownership website
- Submit sitemap: `https://your-domain.com/sitemap.xml`

### 2. Testing Tools

**Meta Tags:**
- [Meta Tags](https://metatags.io/) - Preview OG image
- [OpenGraph.xyz](https://www.opengraph.xyz/) - Test OG tags

**Structured Data:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

**Performance & SEO:**
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Chrome DevTools)

**Mobile Friendly:**
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## 📊 Monitoring & Analytics

### Google Analytics 4 (Opsional)

1. Buat akun di [Google Analytics](https://analytics.google.com/)
2. Install package:
```bash
npm install @next/third-parties
```

3. Tambahkan di `app/layout.tsx`:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

---

## ✅ SEO Best Practices

### Content
- ✅ Gunakan heading hierarchy (H1 → H2 → H3)
- ✅ Setiap page hanya 1 H1
- ✅ Alt text untuk semua gambar
- ✅ Internal linking antar halaman
- ✅ Content unik dan berkualitas

### Technical
- ✅ Fast loading time (<3 detik)
- ✅ Mobile responsive
- ✅ HTTPS enabled
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Structured data (JSON-LD)

### Meta Tags
- ✅ Unique title per page (50-60 karakter)
- ✅ Unique description per page (150-160 karakter)
- ✅ OG image untuk social sharing
- ✅ Canonical URL

---

## 🚨 Common Issues

### Issue: OG Image tidak muncul di WhatsApp/Facebook
**Solusi:**
1. Clear cache di [Facebook Debugger](https://developers.facebook.com/tools/debug/)
2. Pastikan image size 1200x630px
3. Pastikan image accessible (tidak di-block robots.txt)

### Issue: Sitemap tidak terdeteksi
**Solusi:**
1. Akses manual: `https://your-domain.com/sitemap.xml`
2. Submit manual di Google Search Console
3. Pastikan tidak ada error di build

### Issue: Structured data error
**Solusi:**
1. Test di [Rich Results Test](https://search.google.com/test/rich-results)
2. Validasi JSON-LD syntax
3. Pastikan semua required fields ada

---

## 📚 Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)

---

## 🎉 Setelah Setup

1. ✅ Deploy website ke production
2. ✅ Submit sitemap ke Google Search Console
3. ✅ Test semua meta tags
4. ✅ Monitor di Google Analytics
5. ✅ Update content secara berkala

**Good luck! 🚀**
