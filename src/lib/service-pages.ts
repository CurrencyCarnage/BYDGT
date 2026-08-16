import type { StaticImageData } from "next/image";

import accessoriesDesktop from "@/servicespage/accessories-feature-desktop.jpg";
import accessoriesMobile from "@/servicespage/accessories-feature-mobile.jpg";
import finderDesktop from "@/servicespage/product-finder-desktop.jpg";
import finderMobile from "@/servicespage/product-finder-mobile.jpg";
import partsDesktop from "@/servicespage/genuine-spare-parts-desktop.jpg";
import partsMobile from "@/servicespage/genuine-spare-parts-mobile.jpg";
import serviceDesktop from "@/servicespage/official-service-workshop-desktop.jpg";
import serviceMobile from "@/servicespage/official-service-workshop-mobile.jpg";
import heroDesktop from "@/servicespage/services-hero-desktop.jpg";
import heroMobile from "@/servicespage/services-hero-mobile.jpg";

export const SERVICE_PAGE_IDS = [
  "service",
  "spare-parts",
  "accessories",
  "product-finder",
] as const;

export type ServicePageId = (typeof SERVICE_PAGE_IDS)[number];

/**
 * An image slot. `desktop` / `mobile` are the bundled defaults; `override`
 * is an absolute URL supplied later by the admin panel and wins when set.
 * Keeping both means an editor can replace artwork without a deploy, and a
 * missing/removed override silently falls back to the shipped asset.
 */
export type ServiceImageSlot = {
  desktop: StaticImageData;
  mobile: StaticImageData;
  override?: string;
};

export type ServicePageContent = {
  id: ServicePageId;
  href: string;
  /** Index shown in the eyebrow, e.g. "01". */
  index: string;
  hero: ServiceImageSlot;
  feature: ServiceImageSlot;
  /** Anchor on /services this page replaces, kept for legacy links. */
  legacyAnchor: string;
};

export const SERVICE_PAGES: Record<ServicePageId, ServicePageContent> = {
  service: {
    id: "service",
    href: "/services/service",
    index: "01",
    hero: { desktop: serviceDesktop, mobile: serviceMobile },
    feature: { desktop: heroDesktop, mobile: heroMobile },
    legacyAnchor: "#service",
  },
  "spare-parts": {
    id: "spare-parts",
    href: "/services/spare-parts",
    index: "02",
    hero: { desktop: partsDesktop, mobile: partsMobile },
    feature: { desktop: serviceDesktop, mobile: serviceMobile },
    legacyAnchor: "#spare-parts",
  },
  accessories: {
    id: "accessories",
    href: "/services/accessories",
    index: "03",
    hero: { desktop: accessoriesDesktop, mobile: accessoriesMobile },
    feature: { desktop: partsDesktop, mobile: partsMobile },
    legacyAnchor: "#accessories",
  },
  "product-finder": {
    id: "product-finder",
    href: "/services/product-finder",
    index: "04",
    hero: { desktop: finderDesktop, mobile: finderMobile },
    feature: { desktop: accessoriesDesktop, mobile: accessoriesMobile },
    legacyAnchor: "#product-finder",
  },
};

export function getServicePage(id: string): ServicePageContent | undefined {
  return SERVICE_PAGES[id as ServicePageId];
}

/** Ordered list, for navigation and "next section" links. */
export const SERVICE_PAGE_LIST: ServicePageContent[] = SERVICE_PAGE_IDS.map(
  (id) => SERVICE_PAGES[id],
);

/** The three highlight slots every service page renders. */
export const SERVICE_HIGHLIGHT_KEYS = ["a", "b", "c"] as const;
