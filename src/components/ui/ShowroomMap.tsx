"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ShowroomMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
  routePath?: [number, number][];
}

export default function ShowroomMap({ lat, lng, label, address, routePath }: ShowroomMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    // Neutral basemap: keeps roads readable without warm/red overload.
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, subdomains: "abcd" }
    ).addTo(map);

    const hasRoute = Array.isArray(routePath) && routePath.length > 1;
    const resolvedRoute = hasRoute ? routePath : [];

    if (hasRoute) {
      L.polyline(resolvedRoute, {
        color: "#FFFFFF",
        weight: 8,
        opacity: 0.72,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      L.polyline(resolvedRoute, {
        color: "#B01E28",
        weight: 4,
        opacity: 0.95,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      L.circleMarker(resolvedRoute[0], {
        radius: 5,
        color: "#FFFFFF",
        weight: 2,
        fillColor: "#252728",
        fillOpacity: 1,
      }).addTo(map);
    }

    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="
        width: 40px; height: 40px;
        background: #686D71;
        border: 2.5px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 12px rgba(0,0,0,0.30);
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #D70C19;
          position: absolute;
        "></span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="none"/>
        </svg>
      </div>
      <div style="
        width: 2px; height: 10px;
        background: #686D71;
        margin: 0 auto;
      "></div>`,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -54],
    });

    L.marker([lat, lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup(
        `<div style="
          font-family: Montserrat, sans-serif;
          color: #252728;
          padding: 6px 2px;
          min-width: 190px;
          text-align: center;
        ">
          <div style="
            display: inline-block;
            background: #252728;
            color: #fff;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            padding: 2px 8px;
            margin-bottom: 7px;
          ">BYD Tbilisi</div>
          <strong style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 3px; color: #252728;">${label}</strong>
          <span style="font-size: 11px; color: #686D71;">${address}</span><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
             target="_blank" rel="noopener noreferrer"
             style="
               display: inline-block;
               margin-top: 8px;
               font-size: 11px;
               color: #B01E28;
               font-weight: 700;
               letter-spacing: 0.06em;
               text-decoration: none;
               text-transform: uppercase;
             ">
            Get Directions &rarr;
          </a>
        </div>`,
        { maxWidth: 240 }
      )
      .openPopup();

    if (hasRoute) {
      const bounds = L.latLngBounds(resolvedRoute);
      bounds.extend([lat, lng]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, label, address, routePath]);

  return <div ref={containerRef} className="w-full h-full" />;
}
