// src/data/projects.js (atau .ts jika pakai TypeScript)

import Proyek1 from "@/public/assets/projects/bukutahunansiswa.png";
import Proyek2 from "@/public/assets/projects/simpadwebsite.png";
import Proyek3 from "@/public/assets/projects/smestawebsite.png";
import Proyek4 from "@/public/assets/projects/misiwebsite.png";
import Proyek5 from "@/public/assets/projects/websitesagti.png";
import Proyek6 from "@/public/assets/projects/empowerin.png";
import Proyek7 from "@/public/assets/projects/cvalpanagrojaya.png";
import Proyek8 from "@/public/assets/projects/blessingstore.png";
import Proyek9 from "@/public/assets/projects/webujian.png";

export const listProyek = [
  {
    id: 1,
    gambar: Proyek1,
    nama: "Buku Tahunan Siswa",
    desk: "Buku Tahunan Siswa SMKN 1 LUMAJANG",
    tools: ["HTML", "CSS", "Javascript", "PHP"],
    url: "https://jurnalistik.smkn1lmj.sch.id/bts-smk/",
    github: "#",
    role: "Fullstack Dev",
    year: "2025",
    pinned: false,
  },
  {
    id: 2,
    pinned: false,
    gambar: Proyek2,
    nama: "Website Simpad",
    desk: "Website Pajak Daerah Kabupaten Kudus",
    tools: ["Laravel", "Bootstrap", "Javascript", "PHP"],
    url: "https://staging-simpadkuduskab.nusantaratama.com/",
    github: "#",
    role: "Frontend Dev",
    year: "2025",
  },
  {
    id: 3,
    pinned: false,
    gambar: Proyek3,
    nama: "Smesta Website",
    desk: "E-Catalog UKM",
    tools: ["Laravel", "Tailwind", "Javascript", "PHP"],
    url: "https://staging-smesta.nusantaratama.com/",
    github: "#",
    role: "Frontend Dev",
    year: "2025",
  },
  {
    id: 4,
    pinned: false,
    gambar: Proyek4,
    nama: "Misi Website",
    desk: "Aplikasi Manajemen Informasi Peserta Magang Tamara Management",
    tools: ["Laravel", "Bootstrap", "Javascript", "PHP"],
    url: "https://dev-misi.nusantaratama.com/",
    github: "#",
    role: "Frontend Dev",
    year: "2025",
  },
  {
    id: 5,
    pinned: false,
    gambar: Proyek5,
    nama: "Website Sagti",
    desk: "APLIKASI E COMMERCE CV SAGTI",
    tools: ["Laravel", "Tailwind", "Javascript", "PHP"],
    url: "https://staging-depo.nusantaratama.com/",
    github: "#",
    role: "Frontend Dev",
    year: "2025",
  },
  {
    id: 6,
    pinned: false,
    gambar: Proyek6,
    nama: "Empowerin",
    desk: "APLIKASI BAKTI SOSIAL DAN PELATIHAN",
    tools: ["Laravel", "Tailwind", "Javascript", "PHP"],
    url: "https://staging-empowerin.tamaramanagement.co.id/",
    github: "#",
    role: "Fullstack Dev",
    year: "2025",
  },
  {
    id: 7,
    pinned: false,
    gambar: Proyek7,
    nama: "Alpan Agro Jaya",
    desk: "Company Profile Alpan Agro Jaya",
    tools: ["Next JS", "Tailwind", "Javascript", "Node JS"],
    url: "https://alpan-agro-jaya.vercel.app",
    github: "#",
    role: "Frontend Dev",
    year: "2026",
  },
  {
    id: 8,
    pinned: false,
    gambar: Proyek8,
    nama: "Blessing Store",
    desk: "Company Profile Blessing Store",
    tools: ["Next JS", "Tailwind", "Javascript", "Node JS"],
    url: "https://praktikum-sizie.vercel.app/",
    github: "#",
    role: "Frontend Dev",
    year: "2026",
  },
  {
    id: 9,
    pinned: true,
    gambar: Proyek9,
    nama: "Value Academy",
    desk: "Website Ujian Value Academy",
    tools: ["Laravel", "Tailwind", "Javascript", "Node JS"],
    url: "https://ourvalueacademy.com/",
    github: "#",
    role: "Fullstack Dev",
    year: "2026",
  },
];


export const listSertifikat = [
  {
    id: 1,
    kode: "002/NT/PKL/XII/2025",
    gambar: "/assets/sertifikat/sertifikat-1.jpg",
    judul: "Praktek Kerja Lapangan",
    penerbit: "CV NUSANTARA TAMA",
    tanggal: "JULY 2025",
    link: "#",
    tipe: ["Pendidikan", "Profesional"],
    kategori: ["Backend"],
  },
];


export const categories = [
  "Frontend", 
  "Backend", 
  "Fullstack", 
  "Mobile", 
  "Cloud Computing", 
  "Pendidikan", 
  "Profesional",
];
