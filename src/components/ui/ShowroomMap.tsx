"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ShowroomMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
}

// Approximate test-drive loop around BYD Tbilisi (Kakheti Hwy 45A)
// ~5 km loop heading east then north then returning along parallel roads
const TEST_DRIVE_ROUTE: [number, number][] = [
  [41.685144, 44.890980], // Showroom — START
  [41.685500, 44.894800],
  [41.686200, 44.899500],
  [41.687000, 44.904000],
  [41.688500, 44.908200],
  [41.691000, 44.910500],
  [41.694500, 44.910000],
  [41.698000, 44.907500],
  [41.700500, 44.903000],
  [41.701200, 44.897500],
  [41.700000, 44.892000],
  [41.697500, 44.888500],
  [41.694000, 44.886000],
  [41.690000, 44.885500],
  [41.687000, 44.886500],
  [41.685800, 44.888500],
  [41.685144, 44.890980], // Showroom — END
];

export default function ShowroomMap({ lat, lng, label, address }: ShowroomMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Centre map to encompass full route
    const map = L.map(containerRef.current, {
      center: [41.6935, 44.8985],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    // CartoDB Voyager — light, clean, professional
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, subdomains: "abcd" }
    ).addTo(map);

    // ── Route polyline ───────────────────────────────────────────
    // Outer white glow
    L.polyline(TEST_DRIVE_ROUTE, {
      color: "#ffffff",
      weight: 7,
      opacity: 0.25,
    }).addTo(map);

    // Green route line
    L.polyline(TEST_DRIVE_ROUTE, {
      color: "#68D89B",
      weight: 3.5,
      opacity: 0.9,
      dashArray: "10, 6",
    }).addTo(map);

    // ── Direction arrows along route ─────────────────────────────
    // Arrow at mid-route
    const midIdx = Math.floor(TEST_DRIVE_ROUTE.length / 2);
    const arrowPoint = TEST_DRIVE_ROUTE[midIdx];
    const prevPoint  = TEST_DRIVE_ROUTE[midIdx - 1];
    const angle = Math.atan2(
      arrowPoint[1] - prevPoint[1],
      arrowPoint[0] - prevPoint[0]
    ) * (180 / Math.PI);

    const arrowIcon = L.divIcon({
      className: "",
      html: `<div style="
        transform: rotate(${angle}deg);
        color: #68D89B;
        font-size: 20px;
        line-height: 1;
        filter: drop-shadow(0 0 4px rgba(104,216,155,0.6));
      ">➤</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    L.marker(arrowPoint, { icon: arrowIcon }).addTo(map);

    // ── Showroom pin ─────────────────────────────────────────────
    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="
        width: 44px; height: 44px;
        background: #68D89B;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 14px rgba(0,0,0,0.25), 0 0 24px rgba(104,216,155,0.45);
        display: flex; align-items: center; justify-content: center;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1E28" stroke-width="2.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -46],
    });

    L.marker([lat, lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:'Source Sans Pro',sans-serif;color:#1a1e28;text-align:center;padding:6px 4px;min-width:180px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#888;margin-bottom:4px;">Test Drive Start</div>
          <strong style="font-size:15px;display:block;margin-bottom:3px;">${label}</strong>
          <span style="font-size:12px;color:#555;">${address}</span><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
             target="_blank" rel="noopener noreferrer"
             style="display:inline-block;margin-top:8px;font-size:12px;color:#1a7a45;font-weight:600;text-decoration:underline;">
            Get Directions →
          </a>
        </div>`,
        { maxWidth: 240 }
      );

    // ── Route distance badge ─────────────────────────────────────
    const routeBadge = L.divIcon({
      className: "",
      html: `<div style="
        background: rgba(26,30,40,0.85);
        border: 1px solid rgba(104,216,155,0.5);
        color: #68D89B;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .06em;
        padding: 4px 9px;
        border-radius: 20px;
        white-space: nowrap;
        backdrop-filter: blur(4px);
      ">≈ 5 km test route</div>`,
      iconSize: [120, 24],
      iconAnchor: [60, 12],
    });
    // Place badge in upper portion of route
    L.marker([41.7005, 44.9000], { icon: routeBadge }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [lat, lng, label, address]);

  return <div ref={containerRef} className="w-full h-full" />;
}
