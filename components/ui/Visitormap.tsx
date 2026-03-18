"use client";

// components/portfolio/VisitorMap.tsx
// Sumber data: Umami Analytics via /api/visitors

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Globe, MapPin, TrendingUp, RefreshCw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface VisitorEntry {
  id:           string;
  city:         string;
  country:      string;
  country_code: string;
  lat:          number;
  lon:          number;
  flag:         string;
  visits:       number;
}

interface ApiResponse {
  visitors:       VisitorEntry[];
  totalCountries: number;
  totalVisits:    number;
}

// ─── Flag Image ───────────────────────────────────────────────────────────────
// Pakai flagcdn.com supaya bendera selalu tampil di semua OS/browser
// Emoji flag tidak didukung di Windows, jadi pakai <img> sebagai gantinya
function FlagImg({ code, country }: { code: string; country: string }) {
  if (!code || code === "XX") {
    return <span className="text-base leading-none">🌐</span>;
  }
  const c = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/20x15/${c}.png`}
      srcSet={`https://flagcdn.com/40x30/${c}.png 2x`}
      width={20}
      height={15}
      alt={country}
      className="rounded-[2px] object-cover shrink-0"
    />
  );
}

// ─── Dynamic import Leaflet (SSR-safe) ────────────────────────────────────────
const LeafletMap = dynamic(() => import("@/components/ui/Leafletmap"), {
  ssr:     false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800/60">
      <Globe className="h-5 w-5 text-primary animate-pulse" />
    </div>
  ),
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VisitorMap() {
  const [data,       setData]       = useState<ApiResponse | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchData = async (spinner = false) => {
    if (spinner) setRefreshing(true);
    try {
      const res  = await fetch("/api/visitors");
      const json: ApiResponse = await res.json();
      setData(json);
    } catch (e) {
      console.error("[VisitorMap]", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(() => fetchData(), 5 * 60_000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  const visitors  = data?.visitors ?? [];
  const topCities = [...visitors].sort((a, b) => b.visits - a.visits).slice(0, 5);
  const maxVisits = topCities[0]?.visits ?? 1;
  const visits    = loading ? "…" : (data?.totalVisits    ?? 0).toLocaleString();
  const countries = loading ? "…" : (data?.totalCountries ?? 0).toString();
  const cities    = loading ? "…" : visitors.length.toString();

  const barColor = (i: number) =>
    i <= 1 ? "bg-primary" : i === 2 ? "bg-primary/70" : "bg-primary/40";

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <div className="p-5 flex flex-col gap-4">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm">
                <Globe className="h-6 w-6" strokeWidth={2.2} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                  Jejak Pengunjung
                </h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Live
                  </span>
                </div>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Analisis sebaran audiens dari berbagai penjuru wilayah
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="group flex h-9 w-9 items-center justify-center rounded-xl
              border border-neutral-200 dark:border-neutral-800
              bg-white dark:bg-neutral-900 text-neutral-400
              hover:text-blue-600 dark:hover:text-blue-400
              hover:border-blue-200 dark:hover:border-blue-900/50
              shadow-sm active:scale-90 transition-all duration-200"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800/50">
          <div className="flex items-center gap-10">
            {[
              { value: visits,    label: "Kunjungan", icon: <TrendingUp className="h-3.5 w-3.5" /> },
              { value: countries, label: "Negara",    icon: <Globe      className="h-3.5 w-3.5" /> },
              { value: cities,    label: "Kota",      icon: <MapPin     className="h-3.5 w-3.5" /> },
            ].map(({ value, label, icon }, i) => (
              <div key={label} className="flex items-center gap-10">
                {i > 0 && <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800/60" />}
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-neutral-400 dark:text-neutral-500">{icon}</span>
                    <span className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white tracking-tight">
                      {value}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-neutral-400 dark:text-neutral-500">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              30 Hari Terakhir
            </p>
          </div>
        </div>

        {/* ── Map ── */}
        <div className="relative h-[200px] overflow-hidden rounded-xl border border-neutral-100 dark:border-neutral-800">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-800/60">
              <Globe className="h-6 w-6 text-primary animate-pulse" />
            </div>
          ) : (
            <LeafletMap visitors={visitors} />
          )}
        </div>

        {/* ── Top Cities ── */}
        {topCities.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-medium text-neutral-400 dark:text-neutral-500 mb-2">
              Kota teratas
            </p>

            <div className="flex flex-col">
              {topCities.map((v, i) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                >
                  {/* Bendera dari flagcdn.com — tampil di semua OS termasuk Windows */}
                  <FlagImg code={v.country_code} country={v.country} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-[13px] text-neutral-700 dark:text-neutral-300 truncate">
                        {v.city}
                        <span className="text-neutral-400 dark:text-neutral-500 ml-1.5 text-[11px]">
                          {v.country}
                        </span>
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 ml-3 shrink-0">
                        {v.visits.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-[2px] w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${barColor(i)}`}
                        style={{ width: `${(v.visits / maxVisits) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <p className="text-[10px] text-center text-neutral-300 dark:text-neutral-700 -mt-1">
          sumber: umami analytics
        </p>

      </div>
    </div>
  );
}