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

  "/cars",

  "/commercial",

  "/services",

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

    let idleId: number | null = null;

    let timer: number | null = null;



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



    const schedulePrefetch = () => {

      if ("requestIdleCallback" in globalThis) {

        idleId = requestIdleCallback(prefetch, { timeout: 6000 });

      } else {

        timer = setTimeout(prefetch, 3500) as unknown as number;

      }

    };



    if (document.readyState === "complete") {

      schedulePrefetch();

    } else {

      window.addEventListener("load", schedulePrefetch, { once: true });

    }



    return () => {

      window.removeEventListener("load", schedulePrefetch);

      if (idleId !== null && "cancelIdleCallback" in globalThis) {

        cancelIdleCallback(idleId);

      }

      if (timer !== null) {

        clearTimeout(timer);

      }

    };

  }, [pathname, locale]);



  return null;

}


