// components/portfolio/LeafletMap.tsx
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

// ─── Pin icon dengan bendera di dalam ────────────────────────────────────────
// Bentuk: lingkaran besar + ekor segitiga di bawah (GPS pin shape)
// Bendera: <img> dari flagcdn.com supaya tampil di Windows
function createPinIcon(countryCode: string, isTop: boolean) {
  const primary = typeof window !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() || "#3b82f6"
    : "#3b82f6";

  // Seluruh pin pakai SVG murni — lebih reliable di Leaflet divIcon
  // CSS border-trick untuk segitiga sering gagal karena clipping / overflow di divIcon
  const W      = isTop ? 44 : 36;
  const R      = W / 2;
  const tailH  = Math.round(W * 0.45);
  const totalH = W + tailH;
  const cx     = R;
  const cy     = R;

  const triLeft  = Math.round(cx - W * 0.18);
  const triRight = Math.round(cx + W * 0.18);
  const triTip   = totalH;

  const flagCode = countryCode && countryCode !== "XX" ? countryCode.toLowerCase() : null;

  // Tampilkan ISO code sebagai teks di dalam lingkaran (misal "ID", "SG", "MY")
  // foreignObject + img tidak reliable di Leaflet divIcon — teks SVG selalu muncul
  const label    = flagCode ? flagCode.toUpperCase() : "?";
  const fontSize = W <= 36 ? 11 : 13;
  const flagEl   = `<text
    x="${cx}" y="${cy + Math.round(fontSize * 0.38)}"
    text-anchor="middle"
    font-family="system-ui,sans-serif"
    font-size="${fontSize}"
    font-weight="700"
    fill="white"
    letter-spacing="0.5"
  >${label}</text>`;

  const pulse = isTop
    ? `<circle cx="${cx}" cy="${cy}" r="${R + 5}" fill="none"
         stroke="${primary}" stroke-width="2" opacity="0.35"
         style="animation:vpulse 2s ease-out infinite;transform-origin:${cx}px ${cy}px;"/>`
    : "";

  const html = `<svg width="${W}" height="${totalH}" viewBox="0 0 ${W} ${totalH}"
    xmlns="http://www.w3.org/2000/svg" overflow="visible" style="display:block;">
    <defs><style>@keyframes vpulse{0%{transform:scale(1);opacity:.35}70%{transform:scale(1.7);opacity:0}100%{transform:scale(1.7);opacity:0}}</style></defs>
    ${pulse}
    <circle cx="${cx}" cy="${cy}" r="${R - 1.5}" fill="${primary}" stroke="white" stroke-width="2.5"/>
    <polygon points="${triLeft},${W - 4} ${triRight},${W - 4} ${cx},${triTip}" fill="${primary}"/>
    ${flagEl}
  </svg>`;

  return L.divIcon({
    html,
    className:   "leaflet-visitor-pin",
    iconSize:    [W, totalH],
    iconAnchor:  [cx, totalH],
    popupAnchor: [0, -(totalH + 4)],
  });
}

// ─── Tile URLs ────────────────────────────────────────────────────────────────
const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR  = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LeafletMap({ visitors }: Props) {
  const mapRef       = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef     = useRef<L.LayerGroup | null>(null);
  const tileRef      = useRef<L.TileLayer | null>(null);

  const isDark = () =>
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(containerRef.current, {
      center:             [-2.5, 118],
      zoom:               5,
      zoomControl:        true,
      attributionControl: true,
      scrollWheelZoom:    true,
      minZoom:            2,
      maxZoom:            18,
    });

    const tile = L.tileLayer(isDark() ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      subdomains:  "abcd",
      maxZoom:     19,
    }).addTo(map);

    tileRef.current  = tile;
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current   = map;

    const observer = new MutationObserver(() => {
      tileRef.current?.setUrl(isDark() ? TILE_DARK : TILE_LIGHT);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Update markers ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!layerRef.current || !mapRef.current) return;
    layerRef.current.clearLayers();
    if (!visitors.length) return;

    const maxVisits = Math.max(...visitors.map((v) => v.visits));
    const sorted    = [...visitors].sort((a, b) => a.visits - b.visits);

    sorted.forEach((v) => {
      const isTop = v.visits === maxVisits;
      const icon  = createPinIcon(v.country_code ?? "", isTop);

      const flagCode = v.country_code && v.country_code !== "XX"
        ? v.country_code.toLowerCase()
        : null;

      const flagLabel = (v.country_code && v.country_code !== "XX")
        ? v.country_code.toUpperCase()
        : "?";
      const flagHtml = `<span style="
        display:inline-flex;align-items:center;justify-content:center;
        width:28px;height:20px;border-radius:3px;
        background:#3b82f6;color:white;
        font-size:9px;font-weight:700;font-family:system-ui,sans-serif;
        letter-spacing:0.5px;margin-right:8px;flex-shrink:0;
      ">${flagLabel}</span>`;

      const popup = L.popup({
        closeButton: false,
        className:   "visitor-popup",
        offset:      [0, -4],
      }).setContent(`
        <div style="
          font-family:system-ui,sans-serif;
          padding:10px 14px;min-width:155px;
          border-radius:12px;background:white;
          box-shadow:0 4px 20px rgba(0,0,0,0.12);
        ">
          <div style="display:flex;align-items:center;gap:4px;margin-bottom:6px;">
            ${flagHtml}
            <div>
              <div style="font-weight:700;font-size:13px;color:#111;line-height:1.2;">${v.city}</div>
              <div style="font-size:11px;color:#888;">${v.country}</div>
            </div>
          </div>
          <div style="font-size:10px;color:#bbb;border-top:1px solid #f0f0f0;padding-top:6px;">
            ${v.visits.toLocaleString()} kunjungan
          </div>
        </div>
      `);

      L.marker([v.lat, v.lon], { icon })
        .bindPopup(popup)
        .addTo(layerRef.current!);
    });

    const latLngs = visitors.map((v) => [v.lat, v.lon] as [number, number]);
    mapRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40], maxZoom: 8 });
  }, [visitors]);

  return (
    <>
      <style>{`
        @keyframes visitorPulse {
          0%   { transform: scale(1);   opacity: 0.4; }
          70%  { transform: scale(1.6); opacity: 0;   }
          100% { transform: scale(1.6); opacity: 0;   }
        }
        .leaflet-visitor-pin { background: none !important; border: none !important; }
        .visitor-popup .leaflet-popup-content-wrapper {
          padding: 0; border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }
        .visitor-popup .leaflet-popup-content { margin: 0; }
        .visitor-popup .leaflet-popup-tip     { display: none; }
        .leaflet-control-attribution          { font-size: 9px !important; }
        .leaflet-control-zoom a               { border-radius: 8px !important; }
      `}</style>
      <div ref={containerRef} className="w-full h-full z-0" />
    </>
  );
}