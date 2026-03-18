// components/portofolio/LeafletMap.tsx
// Komponen Leaflet map (diimport secara dynamic dari VisitorMap)
// Jangan import langsung — selalu lewat dynamic() untuk menghindari SSR error

"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface VisitorEntry {
  id:           string;
  city:         string;
  country:      string;
  country_code: string;
  lat:          number;
  lon:          number;
  flag?:        string;
  visits:       number;
}

interface Props {
  visitors: VisitorEntry[];
}

// ─── Custom pin icon ──────────────────────────────────────────────────────────
function createPinIcon(flag: string, isRecent: boolean) {
  // Get CSS variable --theme-primary at runtime
  const primary = typeof window !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--theme-primary").trim() || "#3b82f6"
    : "#3b82f6";

  const size    = isRecent ? 36 : 28;
  const pulse   = isRecent
    ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${primary}" opacity="0.25">
        <animate attributeName="r" from="${size / 2 - 4}" to="${size / 2 + 4}" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite"/>
       </circle>`
    : "";

  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;">
        ${pulse}
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - (isRecent ? 6 : 5)}"
          fill="${primary}" stroke="white" stroke-width="2" opacity="${isRecent ? 1 : 0.85}"/>
      </svg>
      <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:${isRecent ? 14 : 11}px;line-height:1;">
        ${flag || "📍"}
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className:   "leaflet-visitor-pin",
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

// ─── Map tile style — CartoDB Positron (clean, no label clutter) ──────────────
const TILE_URL_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_URL_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR      = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LeafletMap({ visitors }: Props) {
  const mapRef       = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef     = useRef<L.LayerGroup | null>(null);
  const tileRef      = useRef<L.TileLayer | null>(null);

  // Detect dark mode
  const isDark = () =>
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // ── Init map once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Fix default marker icon path (common Leaflet issue with bundlers)
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(containerRef.current, {
      // Focus Indonesia by default
      center:          [-2.5, 118],
      zoom:            5,
      zoomControl:     true,
      attributionControl: true,
      scrollWheelZoom: true,
      minZoom:         2,
      maxZoom:         18,
    });

    // Tile layer
    const tile = L.tileLayer(isDark() ? TILE_URL_DARK : TILE_URL_LIGHT, {
      attribution: TILE_ATTR,
      subdomains:  "abcd",
      maxZoom:     19,
    }).addTo(map);

    tileRef.current  = tile;
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current   = map;

    // Watch dark mode changes
    const observer = new MutationObserver(() => {
      const url = isDark() ? TILE_URL_DARK : TILE_URL_LIGHT;
      tileRef.current?.setUrl(url);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Update markers when visitors change ────────────────────────────────────
  useEffect(() => {
    if (!layerRef.current || !mapRef.current) return;

    layerRef.current.clearLayers();
    if (!visitors.length) return;

    // Sort by visits — paling banyak di atas
    const sorted = [...visitors].sort((a, b) => a.visits - b.visits);

    sorted.forEach((v) => {
      const isTop = v.visits === visitors[0]?.visits;
      const icon  = createPinIcon(v.flag ?? "", isTop);

      const popup = L.popup({
        closeButton: false,
        className:   "visitor-popup",
        offset:      [0, -8],
      }).setContent(`
        <div style="font-family:system-ui,sans-serif;padding:10px 14px;min-width:150px;border-radius:12px;background:white;box-shadow:0 4px 20px rgba(0,0,0,0.12);">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:20px;">${v.flag || "🌐"}</span>
            <div>
              <div style="font-weight:700;font-size:13px;color:#111;">${v.city}</div>
              <div style="font-size:11px;color:#888;">${v.country}</div>
            </div>
          </div>
          <div style="font-size:10px;color:#aaa;border-top:1px solid #f0f0f0;padding-top:6px;">
            ${v.visits.toLocaleString()} kunjungan
          </div>
        </div>
      `);

      L.marker([v.lat, v.lon], { icon })
        .bindPopup(popup)
        .addTo(layerRef.current!);
    });

    // Auto-fit bounds
    const latLngs = visitors.map((v) => [v.lat, v.lon] as [number, number]);
    if (latLngs.length > 0) {
      mapRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40], maxZoom: 8 });
    }
  }, [visitors]);

  return (
    <>
      <style>{`
        .leaflet-visitor-pin { background: none !important; border: none !important; }
        .visitor-popup .leaflet-popup-content-wrapper { padding: 0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
        .visitor-popup .leaflet-popup-content { margin: 0; }
        .visitor-popup .leaflet-popup-tip { display: none; }
        .leaflet-control-attribution { font-size: 9px !important; }
        .leaflet-control-zoom a { border-radius: 8px !important; }
      `}</style>
      <div ref={containerRef} className="w-full h-full z-0" />
    </>
  );
}