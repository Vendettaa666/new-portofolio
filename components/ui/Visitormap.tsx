"use client";

// components/portofolio/VisitorMap.tsx
//
// Install dependency:
//   npm install leaflet react-leaflet
//   npm install -D @types/leaflet
//
// Tambahkan di globals.css atau layout:
//   import "leaflet/dist/leaflet.css";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Globe,
  Users,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Maximize2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface VisitorEntry {
  ip:           string;
  city:         string;
  country:      string;
  country_code: string;
  lat:          number;
  lon:          number;
  timestamp:    number;
  flag?:        string;
}

// ─── Dynamic import Leaflet (SSR-safe) ────────────────────────────────────────
const LeafletMap = dynamic(() => import("@/components/ui/Leafletmap"), {
  ssr:     false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl">
      <div className="flex flex-col items-center gap-2">
        <Globe className="h-7 w-7 text-primary animate-pulse" />
        <span className="text-xs text-neutral-400">Memuat peta…</span>
      </div>
    </div>
  ),
});

// ─── Relative time ────────────────────────────────────────────────────────────
function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  if (m < 1)  return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

// ─── Stats helpers ────────────────────────────────────────────────────────────
function uniqueCountries(visitors: VisitorEntry[]) {
  return new Set(visitors.map((v) => v.country_code)).size;
}

function uniqueCities(visitors: VisitorEntry[]) {
  return new Set(visitors.map((v) => `${v.city}-${v.country_code}`)).size;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VisitorMap() {
  const [visitors,  setVisitors]  = useState<VisitorEntry[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded,  setExpanded]  = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchVisitors = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res  = await fetch("/api/visitors");
      const json = await res.json();
      setVisitors(json.visitors ?? []);
    } catch (e) {
      console.error("[VisitorMap]", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
    const id = setInterval(() => fetchVisitors(), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  const recent = [...visitors]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 7);

  const mapHeight = expanded ? "h-[480px]" : "h-[280px]";

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 transition-all duration-200">

      {/* ── Primary accent line ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-80" />

      <div className="relative p-6 md:p-8 flex flex-col gap-5">

        {/* ════════════════════════════════
            HEADER
        ════════════════════════════════ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Visitor Map
              </h3>
              <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-400">
                Lokasi pengunjung website secara real-time
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchVisitors(true)}
              title="Refresh"
              className="flex h-8 w-8 items-center justify-center rounded-xl
                border border-neutral-200 dark:border-neutral-700
                text-neutral-400 hover:text-primary
                hover:bg-neutral-50 dark:hover:bg-neutral-700/50
                transition-all duration-150"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              title={expanded ? "Perkecil" : "Perbesar"}
              className="flex h-8 w-8 items-center justify-center rounded-xl
                border border-neutral-200 dark:border-neutral-700
                text-neutral-400 hover:text-primary
                hover:bg-neutral-50 dark:hover:bg-neutral-700/50
                transition-all duration-150"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ════════════════════════════════
            STAT ROW
        ════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon:  <Users className="h-3.5 w-3.5 text-primary" />,
              label: "Total Visitor",
              value: loading ? "…" : visitors.length.toLocaleString(),
              hl:    true,
            },
            {
              icon:  <Globe className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />,
              label: "Negara",
              value: loading ? "…" : uniqueCountries(visitors).toString(),
              hl:    false,
            },
            {
              icon:  <MapPin className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />,
              label: "Kota",
              value: loading ? "…" : uniqueCities(visitors).toString(),
              hl:    false,
            },
          ].map(({ icon, label, value, hl }) => (
            <div
              key={label}
              className={`flex flex-col gap-1 rounded-2xl p-3.5 border transition-all duration-200 ${
                hl
                  ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                  : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
              }`}
            >
              <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                hl ? "bg-primary/15" : "bg-neutral-100 dark:bg-neutral-700/50"
              }`}>
                {icon}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 mt-0.5">
                {label}
              </span>
              <span className={`text-xl font-black font-mono leading-tight ${
                hl ? "text-primary" : "text-neutral-900 dark:text-white"
              }`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════
            MAP
        ════════════════════════════════ */}
        <div className={`relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 transition-all duration-500 ${mapHeight}`}>
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800/60">
              <div className="flex flex-col items-center gap-2">
                <Globe className="h-7 w-7 text-primary animate-pulse" />
                <span className="text-xs text-neutral-400">Memuat data…</span>
              </div>
            </div>
          ) : (
            <LeafletMap visitors={visitors} />
          )}
        </div>

        {/* ════════════════════════════════
            RECENT VISITORS LIST
        ════════════════════════════════ */}
        {recent.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-700/50" />
              <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 shrink-0 px-1">
                Pengunjung Terbaru
              </span>
              <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-700/50" />
            </div>

            <div className="flex flex-col gap-1">
              {recent.map((v, i) => (
                <div
                  key={`${v.ip}-${i}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl
                    hover:bg-neutral-50 dark:hover:bg-neutral-700/40
                    transition-colors duration-150"
                >
                  {/* Flag */}
                  <span className="text-lg shrink-0 w-6 text-center" aria-label={v.country}>
                    {v.flag || "🌐"}
                  </span>

                  {/* Location */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate leading-tight">
                      {v.city}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                      {v.country}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="text-[10px] font-mono text-neutral-300 dark:text-neutral-600 shrink-0">
                    {timeAgo(v.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            FOOTER
        ════════════════════════════════ */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            <ShieldCheck className="h-3 w-3" />
            IP disamarkan · Data diperbarui tiap 1 menit
          </div>
        </div>

      </div>
    </div>
  );
}