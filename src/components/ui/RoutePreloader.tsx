"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

/**
 * Background route prefetcher.
 * After the current page finishes loading, prefetches all public routes
 * so subsequent navigations are instant (HTML is already cached).
 * Image preloading is handled by the SplashScreen component.
 */

const PUBLIC_ROUTES = [
  "/",
  "/catalog",
  "/catalog/sealion-06-dmi",
  "/catalog/seal-06-dmi",
  "/catalog/yuan-up-ev",
  "/catalog/yuan-up-dmi",
  "/compare",
  "/booking",
  "/contact",
  "/about",
];

export default function RoutePreloader() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const prefetch = () => {
      PUBLIC_ROUTES.forEach((route) => {
        const localizedRoute = `/${locale}${route === "/" ? "" : route}`;
        if (pathname === localizedRoute || pathname === `/${locale}${route}`) return;

        const existing = document.querySelector(
          `link[rel="prefetch"][href="${localizedRoute}"]`
        );
        if (existing) return;

        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = localizedRoute;
        link.as = "document";
        document.head.appendChild(link);
      });
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(prefetch, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(prefetch, 2000);
      return () => clearTimeout(timer);
    }
  }, [pathname, locale]);

  return null;
}
