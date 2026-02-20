# 🗺️ PANDUAN ROUTING - Next.js App Router

## 📁 Struktur Folder yang Sudah Dibuat

```
app/
├── page.tsx              → Homepage (Dashboard)     → http://localhost:3000/
├── about/
│   └── page.tsx          → Halaman About            → http://localhost:3000/about
├── projects/
│   └── page.tsx          → Halaman Projects         → http://localhost:3000/projects
├── stack/
│   └── page.tsx          → Halaman Tech Stack       → http://localhost:3000/stack
└── contact/
    └── page.tsx          → Halaman Contact          → http://localhost:3000/contact
```

## 🎯 Cara Kerja Routing di Next.js

### 1️⃣ File-Based Routing
Next.js menggunakan sistem routing berbasis folder:
- Setiap **folder** = **route segment**
- File **page.tsx** = halaman yang bisa diakses

### 2️⃣ Contoh:
```
app/about/page.tsx  →  /about
app/projects/page.tsx  →  /projects
```

## 🔗 Navigasi di Sidebar

Sidebar sudah dikonfigurasi dengan menu navigasi:

```typescript
const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: User, label: "About", href: "/about" },        ← Klik ini → buka /about
  { icon: Layers, label: "Projects", href: "/projects" }, ← Klik ini → buka /projects
  { icon: Code, label: "Stack", href: "/stack" },         ← Klik ini → buka /stack
  { icon: Mail, label: "Contact", href: "/contact" },     ← Klik ini → buka /contact
];
```

## 🎨 Halaman yang Sudah Dibuat

### 1. Homepage (/)
- Hero card dengan informasi utama
- Project cards
- Overview dashboard

### 2. About (/about)
- Bio dan deskripsi diri
- Skills dengan progress bar animasi
- Experience & Education timeline
- Interests cards

### 3. Projects (/projects)
- Grid layout project cards
- Gambar project dengan hover effect
- Tags teknologi
- GitHub stats (stars & forks)
- Link ke demo & repository

### 4. Stack (/stack)
- Kategori teknologi (Frontend, Backend, Tools, Design)
- Level keahlian (Expert, Advanced, Intermediate)
- Color-coded cards
- "Always Learning" section

### 5. Contact (/contact)
- Contact information cards
- Social media links
- Contact form dengan validasi
- Responsive layout

## 🚀 Cara Menggunakan

### 1. Jalankan Development Server
```cmd
npm run dev
```

### 2. Buka Browser
```
http://localhost:3000
```

### 3. Navigasi
- Klik menu di **Sidebar** (kiri)
- Atau ketik URL langsung di browser:
  - `http://localhost:3000/about`
  - `http://localhost:3000/projects`
  - `http://localhost:3000/stack`
  - `http://localhost:3000/contact`

## 🎯 Active State di Sidebar

Sidebar otomatis mendeteksi halaman aktif:
```typescript
const pathname = usePathname();
const isActive = pathname === item.href;
```

Ketika halaman aktif:
- Background berubah jadi **biru** (bg-blue-600)
- Text berubah jadi **putih**
- Ada **shadow effect**
- Muncul **dot indicator** di kanan

## ✨ Fitur Setiap Halaman

### About Page
- ✅ Animasi smooth dengan Framer Motion
- ✅ Progress bar skills yang animated
- ✅ Timeline experience
- ✅ Interest cards dengan hover effect
- ✅ Responsive design
- ✅ Dark mode support

### Projects Page
- ✅ Grid layout responsive
- ✅ Image hover dengan scale effect
- ✅ Quick action buttons (GitHub & Demo)
- ✅ Technology tags
- ✅ Stats display
- ✅ Dark mode support

### Stack Page
- ✅ Kategori dengan gradient header
- ✅ Level badges (Expert, Advanced, Intermediate)
- ✅ Hover effects
- ✅ "Always Learning" section
- ✅ Dark mode support

### Contact Page
- ✅ Contact info cards
- ✅ Social media links
- ✅ Working contact form
- ✅ Form validation
- ✅ Responsive layout
- ✅ Dark mode support

## 🎨 Customisasi

### Mengubah Konten
Edit file page.tsx di masing-masing folder:
- `app/about/page.tsx` - Ubah bio, skills, experience
- `app/projects/page.tsx` - Tambah/edit projects
- `app/stack/page.tsx` - Update tech stack
- `app/contact/page.tsx` - Ubah contact info

### Menambah Halaman Baru
1. Buat folder baru di `app/`
2. Buat file `page.tsx` di dalamnya
3. Tambahkan route di sidebar (`components/layout/Sidebar.tsx`)

Contoh membuat halaman Blog:
```
app/
└── blog/
    └── page.tsx  → /blog
```

Tambahkan di Sidebar:
```typescript
const navItems = [
  // ... existing items
  { icon: BookOpen, label: "Blog", href: "/blog" },
];
```

## 🐛 Troubleshooting

### Halaman tidak muncul?
1. Pastikan file bernama `page.tsx` (bukan `Page.tsx` atau `index.tsx`)
2. Pastikan ada `export default function`
3. Restart development server

### Navigasi tidak bekerja?
1. Cek href di Sidebar sesuai dengan folder name
2. Pastikan menggunakan `<Link>` dari `next/link`
3. Cek console browser untuk error

### Styling tidak muncul?
1. Pastikan ada `"use client"` di atas file
2. Cek import Tailwind CSS di `globals.css`
3. Hard refresh browser (Ctrl+Shift+R)

## 📚 Referensi

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Framer Motion](https://www.framer.com/motion/)
