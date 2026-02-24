"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, ExternalLink, ShieldCheck, X, Search, ChevronDown } from "lucide-react";
import GlareHover from "@/components/ui/GlareHover";

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

const categories = [
  "Frontend", "Backend", "Fullstack", "Mobile", "Cloud Computing", "Pendidikan", "Profesional",
];

export default function AchievementPage() {
  const [selectedCert, setSelectedCert] = useState<typeof listSertifikat[0] | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // === STATE FILTER ===
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle pilih kategori
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Filter kategori di dalam dropdown search
  const filteredCategoryList = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // === HASIL FILTER ===
  const filteredSertifikat = useMemo(() => {
    return listSertifikat.filter((cert) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        q === "" ||
        cert.judul.toLowerCase().includes(q) ||
        cert.penerbit.toLowerCase().includes(q) ||
        cert.kode.toLowerCase().includes(q);

      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(
          (cat) =>
            cert.kategori.includes(cat) || cert.tipe.includes(cat)
        );

      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategories]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 p-4 md:p-6 lg:p-8 lg:py-12 transition-colors duration-200">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            Pencapaian
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base">
            Koleksi sertifikat dan lencana yang telah saya raih sepanjang perjalanan profesional dan akademik saya.
          </p>
        </div>

        <div className="border-b border-dashed border-neutral-300 dark:border-neutral-700 w-full" />

        {/* FILTER & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 items-start w-full">
          {/* Search Input */}
          <div className="relative w-full md:w-2/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Search by title, publisher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-1/3" ref={dropdownRef}>
            <div
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`flex items-center justify-between w-full px-4 py-2.5 bg-transparent border rounded-xl text-sm cursor-pointer transition-colors ${isCategoryOpen || selectedCategories.length > 0
                  ? "border-neutral-500 dark:border-neutral-500 text-neutral-900 dark:text-white"
                  : "border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400"
                }`}
            >
              <span>
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} kategori dipilih`
                  : "Filter by Category"}
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`}
              />
            </div>

            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-20 overflow-hidden"
                >
                  {/* Search inside dropdown */}
                  <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 relative">
                    <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search category"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full bg-transparent pl-8 pr-4 py-1.5 text-sm focus:outline-none dark:text-white"
                    />
                  </div>

                  {/* Category list */}
                  <div className="max-h-60 overflow-y-auto p-2">
                    {filteredCategoryList.length > 0 ? (
                      filteredCategoryList.map((cat, idx) => {
                        const isSelected = selectedCategories.includes(cat);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleCategory(cat)}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${isSelected
                                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-200"
                              }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <X size={14} />}
                          </div>
                        );
                      })
                    ) : (
                      <p className="px-4 py-3 text-sm text-neutral-500">Tidak ditemukan</p>
                    )}
                  </div>

                  {/* Clear button */}
                  {selectedCategories.length > 0 && (
                    <div className="p-2 border-t border-neutral-200 dark:border-neutral-800">
                      <button
                        onClick={() => { setSelectedCategories([]); setIsCategoryOpen(false); }}
                        className="w-full text-center text-xs font-medium text-red-500 hover:text-red-600 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active filter badges */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              >
                {cat}
                <X size={12} />
              </span>
            ))}
          </div>
        )}

        {/* TOTAL */}
        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Menampilkan{" "}
          <span className="text-neutral-900 dark:text-white font-bold">{filteredSertifikat.length}</span>{" "}
          dari {listSertifikat.length} sertifikat
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSertifikat.length > 0 ? (
              filteredSertifikat.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="w-full h-full cursor-pointer flex"
                  onClick={() => setSelectedCert(cert)}
                >
                  <GlareHover width="100%" height="100%" background="transparent" borderRadius="1.5rem">
                    <div className="relative h-full flex flex-col bg-white dark:bg-[#111] border border-neutral-300 dark:border-neutral-800 rounded-[1.5rem] overflow-hidden group">

                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                        <img
                          src={typeof cert.gambar === "string" ? cert.gambar : (cert.gambar as any)?.src}
                          alt={cert.judul}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs border border-white/20 transition-all">
                            Lihat Detail
                          </span>
                        </div>
                      </div>

                      <div className="p-5 md:p-6 flex flex-col flex-grow">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2 font-mono truncate">
                          {cert.kode}
                        </p>
                        <div className="mb-4">
                          <h3 className="text-lg font-bold mb-1 dark:text-neutral-100 leading-tight line-clamp-2">
                            {cert.judul}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {cert.penerbit}
                          </p>
                        </div>
                        <div className="flex-grow" />
                        <div className="flex flex-wrap gap-2 mb-4">
                          {cert.tipe?.map((t, i) => (
                            <span key={i} className="px-3 py-1 text-xs rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50">
                              {t}
                            </span>
                          ))}
                          {cert.kategori?.map((k, i) => (
                            <span key={i} className="px-3 py-1 text-xs rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50">
                              {k}
                            </span>
                          ))}
                        </div>
                        <div className="border-t border-neutral-200 dark:border-neutral-800/60 pt-4 mt-auto">
                          <p className="text-xs text-neutral-500 dark:text-neutral-500 uppercase tracking-wider font-medium">
                            ISSUED ON {cert.tanggal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlareHover>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-500 dark:text-neutral-600 gap-3"
              >
                <Search size={40} strokeWidth={1.5} />
                <p className="font-medium">Tidak ada hasil yang ditemukan</p>
                <p className="text-sm">Coba ubah kata kunci atau filter kategori</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategories([]); }}
                  className="mt-2 text-sm text-neutral-900 dark:text-white underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Reset semua filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
                <div className="flex-[2] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center p-2 min-h-[300px]">
                  <img
                    src={typeof selectedCert.gambar === "string" ? selectedCert.gambar : (selectedCert.gambar as any)?.src}
                    alt={selectedCert.judul}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-neutral-900">
                  <div>
                    <div className="flex items-center gap-2 text-blue-400 mb-4">
                      <ShieldCheck size={20} />
                      <span className="text-xs font-bold uppercase tracking-widest">Verified Achievement</span>
                    </div>
                    <p className="text-neutral-500 text-sm mb-2">{selectedCert.kode}</p>
                    <h2 className="text-2xl font-bold text-neutral-500 dark:text-white mb-4">{selectedCert.judul}</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-neutral-400 dark:text-neutral-300">
                        <Award className="text-blue-500" size={18} />
                        <span>Penerbit: <strong>{selectedCert.penerbit}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-400 dark:text-neutral-300">
                        <Calendar className="text-neutral-500" size={18} />
                        <span>Diterbitkan: {selectedCert.tanggal}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <a
                      href={selectedCert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20"
                    >
                      <ExternalLink size={18} />
                      Verifikasi Keaslian
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}