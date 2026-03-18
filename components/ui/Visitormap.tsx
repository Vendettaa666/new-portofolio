"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Globe, Users, MapPin, RefreshCw } from "lucide-react";

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

const LeafletMap = dynamic(() => import("@/components/ui/Leafletmap"), {
  ssr:     false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl">
      <Globe className="h-6 w-6 text-primary animate-pulse" />
    </div>
  ),
});

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
      const json = await res.json();
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
    const id = setInterval(() => fetchData(), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  const visitors       = data?.visitors ?? [];
  const totalCountries = data?.totalCountries ?? 0;
  const totalVisits    = data?.totalVisits ?? 0;
  const topCities      = visitors.slice(0, 5);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-80" />

      <div className="p-5 md:p-6 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Globe className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Visitor Map</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">30 hari terakhir</p>
            </div>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-primary hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Users className="h-3.5 w-3.5 text-primary" />,   label: "Kunjungan", value: loading ? "…" : totalVisits.toLocaleString(),    hl: true  },
            { icon: <Globe className="h-3.5 w-3.5 text-neutral-400" />, label: "Negara",    value: loading ? "…" : totalCountries.toString(),        hl: false },
            { icon: <MapPin className="h-3.5 w-3.5 text-neutral-400" />, label: "Kota",    value: loading ? "…" : visitors.length.toString(),        hl: false },
          ].map(({ icon, label, value, hl }) => (
            <div key={label} className={`flex flex-col gap-1 rounded-2xl p-3 border ${
              hl ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                 : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
            }`}>
              <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                hl ? "bg-primary/15" : "bg-neutral-100 dark:bg-neutral-700/50"
              }`}>{icon}</div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">{label}</span>
              <span className={`text-lg font-black font-mono leading-tight ${hl ? "text-primary" : "text-neutral-900 dark:text-white"}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="relative h-[240px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800/60">
              <Globe className="h-7 w-7 text-primary animate-pulse" />
            </div>
          ) : (
            <LeafletMap visitors={visitors} />
          )}
        </div>

        {/* Top cities */}
        {topCities.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 px-1">
              Kota Teratas
            </p>
            {topCities.map((v) => (
              <div key={v.id} className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition-colors">
                <span className="text-base w-6 text-center shrink-0">{v.flag || "🌐"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{v.city}</p>
                  <p className="text-xs text-neutral-400 truncate">{v.country}</p>
                </div>
                <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
                  {v.visits.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
