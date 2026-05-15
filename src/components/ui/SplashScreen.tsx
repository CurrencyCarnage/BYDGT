"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const ASSET_V = "20260503a";

/* ── Only preload what's critical for a smooth first experience ────────────
   Wheel sprites (8 × ~40 KB = 320 KB total) — needed for car roll-in
   animation in ModelShowcase. Everything else loads via Next.js `priority`
   or progressively as the user scrolls.
   ────────────────────────────────────────────────────────────────────────── */
const WHEEL_SPRITES: string[] = [
  ...["sealion-06-dmi", "seal-06-dmi", "yuan-up-ev", "yuan-up-dmi"].flatMap(
    (id) => [
      `/images/homepage/mapped-wheels/${id}-front.png?v=${ASSET_V}`,
      `/images/homepage/mapped-wheels/${id}-rear.png?v=${ASSET_V}`,
    ]
  ),
];

const TOTAL = WHEEL_SPRITES.length;
const SESSION_KEY = "byd-preloaded";
const MIN_DISPLAY_MS = 600; // Minimum splash display for smooth feel
const SAFETY_TIMEOUT_MS = 5000;

export default function SplashScreen() {
  // Starts "visible" so SSR HTML shows the splash immediately (no JS needed).
  // The inline <script> in layout.tsx hides #byd-splash for returning visitors
  // before the browser ever paints it, so there's no flash.
  const [phase, setPhase] = useState<"visible" | "fadeout" | "done">("visible");
  const loadedRef = useRef(0);
  const resolvedRef = useRef(false);
  const startRef = useRef(0);

  const finish = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    // Ensure minimum display time so the splash doesn't flash too briefly
    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    setTimeout(() => {
      setPhase("fadeout");
      setTimeout(() => setPhase("done"), 600);
    }, remaining);
  }, []);

  const tick = useCallback(() => {
    loadedRef.current++;
    if (loadedRef.current >= TOTAL) finish();
  }, [finish]);

  useEffect(() => {
    // Skip if already preloaded this session (React-level cleanup;
    // the inline script in layout already hid us visually)
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setPhase("done");
        return;
      }
    } catch {}

    startRef.current = Date.now();

    // Preload wheel sprites via new Image() — warms browser cache so
    // the <img> elements in ModelShowcase have them ready instantly
    WHEEL_SPRITES.forEach((src) => {
      const img = new window.Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    });

    // Safety timeout — never block the page longer than 5s
    const safety = setTimeout(finish, SAFETY_TIMEOUT_MS);
    return () => clearTimeout(safety);
  }, [tick, finish]);

  if (phase === "done") return null;

  return (
    <div
      id="byd-splash"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      style={{
        opacity: phase === "visible" ? 1 : 0,
        transition: phase === "fadeout" ? "opacity 600ms ease" : "none",
        pointerEvents: phase === "fadeout" ? "none" : "auto",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/loadingphase/BYDLoading.gif"
        alt="Loading BYD..."
        width={90}
        height={90}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
