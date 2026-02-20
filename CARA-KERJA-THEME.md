# 🎨 CARA KERJA THEME SWITCHING - PENJELASAN SEDERHANA

## 📋 ALUR LENGKAP (Step by Step)

```
┌─────────────────────────────────────────────────────────────┐
│  1. USER KLIK TOMBOL SUN/MOON DI NAVBAR                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. ThemeToggle.tsx memanggil setTheme('dark')              │
│     atau setTheme('light')                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. ThemeProvider (next-themes) menambahkan class           │
│     ke tag <html>                                           │
│                                                             │
│     Dark Mode:  <html class="dark">                         │
│     Light Mode: <html class="">                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Tailwind CSS membaca class "dark" dan menerapkan        │
│     warna yang sesuai                                       │
│                                                             │
│     Contoh:                                                 │
│     bg-white dark:bg-[#0a0a0a]                              │
│                                                             │
│     Kalau ada class="dark" → pakai bg-[#0a0a0a] (hitam)    │
│     Kalau tidak ada         → pakai bg-white (putih)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. SEMUA KOMPONEN BERUBAH WARNA!                           │
│     - Sidebar berubah                                       │
│     - Navbar berubah                                        │
│     - Content berubah                                       │
│     - Cards berubah                                         │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 KOMPONEN YANG TERLIBAT

### 1. ThemeProvider (components/layout/ThemeProvider.tsx)
**Fungsi:** Mengatur theme untuk seluruh aplikasi
**Cara kerja:** Menambahkan/menghapus class "dark" di tag <html>

### 2. ThemeToggle (components/layout/ThemeToggle.tsx)
**Fungsi:** Tombol untuk ganti theme
**Cara kerja:** Ketika diklik, memanggil setTheme() untuk ubah theme

### 3. Tailwind CSS (app/globals.css)
**Fungsi:** Menerapkan warna berdasarkan class "dark"
**Cara kerja:** Membaca class di HTML dan menerapkan style yang sesuai

## 🎯 CONTOH KONKRET

### Sebelum Klik (Light Mode):
```html
<html class="">
  <body>
    <div class="bg-white dark:bg-[#0a0a0a]">
      <!-- Tailwind pakai bg-white karena tidak ada class "dark" -->
      <!-- Background jadi PUTIH -->
    </div>
  </body>
</html>
```

### Setelah Klik (Dark Mode):
```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-[#0a0a0a]">
      <!-- Tailwind pakai bg-[#0a0a0a] karena ada class "dark" -->
      <!-- Background jadi HITAM -->
    </div>
  </body>
</html>
```

## 🐛 CARA DEBUG

### 1. Buka Browser Console (F12)
Ketik ini di console:
```javascript
document.documentElement.className
```

**Hasilnya:**
- Kalau dark mode: `"dark"`
- Kalau light mode: `""`

### 2. Lihat Debug Box (Pojok Kanan Bawah)
Debug box akan menampilkan:
- Theme saat ini
- HTML class
- Tombol untuk test

### 3. Cek di Browser DevTools
1. Klik kanan → Inspect
2. Lihat tag `<html>`
3. Perhatikan apakah ada `class="dark"` saat klik tombol

## ✅ CARA MENJALANKAN

1. **Stop server yang running:**
   ```cmd
   Ctrl+C di terminal
   ```

2. **Hapus cache:**
   ```cmd
   rmdir /s /q .next
   ```

3. **Jalankan server:**
   ```cmd
   npm run dev
   ```

4. **Buka browser:**
   - Buka http://localhost:3000
   - Tekan Ctrl+Shift+R (hard refresh)

5. **Test theme:**
   - Klik tombol Sun/Moon di navbar (pojok kanan atas)
   - Atau klik tombol di debug box (pojok kanan bawah)
   - Lihat apakah warna berubah

## 🎨 WARNA YANG BERUBAH

### Light Mode:
- Background: Putih (#ffffff)
- Text: Hitam (#171717)
- Sidebar: Putih dengan border abu-abu terang
- Cards: Abu-abu terang (#f5f5f5)

### Dark Mode:
- Background: Hitam (#0a0a0a)
- Text: Putih (#ededed)
- Sidebar: Hitam dengan border abu-abu gelap
- Cards: Abu-abu gelap (#171717)

## 🚨 TROUBLESHOOTING

### Masalah: Warna tidak berubah
**Solusi:**
1. Cek console browser untuk error
2. Pastikan tidak ada server lain yang running
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh (Ctrl+Shift+R)

### Masalah: Tombol tidak muncul
**Solusi:**
1. Cek apakah ThemeToggle ada di Navbar
2. Cek console untuk error
3. Restart development server

### Masalah: Class "dark" tidak ditambahkan
**Solusi:**
1. Cek apakah ThemeProvider membungkus semua komponen
2. Cek apakah next-themes terinstall: `npm list next-themes`
3. Reinstall jika perlu: `npm install next-themes`

## 📝 KESIMPULAN

Theme switching bekerja dengan cara:
1. User klik tombol
2. JavaScript menambahkan class "dark" ke HTML
3. Tailwind CSS membaca class tersebut
4. Warna berubah otomatis

Sederhana kan? 😊
