import type { StaticImageData } from "next/image";

import commercialDesktop from "@/landingpage/commercial-vehicles-desktop.jpg";
import commercialMobile from "@/landingpage/commercial-vehicles-mobile.jpg";
import passengerDesktop from "@/landingpage/passenger-cars-desktop.jpg";
import passengerMobile from "@/landingpage/passenger-cars-mobile.jpg";
import servicesDesktop from "@/landingpage/services-desktop.jpg";
import servicesMobile from "@/landingpage/services-mobile.jpg";

export type LandingPanelId = "passenger" | "commercial" | "services";

export type LandingPanelDefinition = {
  id: LandingPanelId;
  number: "01" | "02" | "03";
  href: "/cars" | "/commercial" | "/services";
  desktopImage: StaticImageData;
  mobileImage: StaticImageData;
  featureKeys: readonly string[];
};

export const landingPanels: readonly LandingPanelDefinition[] = [
  { id: "passenger", number: "01", href: "/cars", desktopImage: passengerDesktop, mobileImage: passengerMobile, featureKeys: ["ev", "hybrid", "safety", "technology"] },
  { id: "commercial", number: "02", href: "/commercial", desktopImage: commercialDesktop, mobileImage: commercialMobile, featureKeys: ["light", "heavy", "buses", "support"] },
  { id: "services", number: "03", href: "/services", desktopImage: servicesDesktop, mobileImage: servicesMobile, featureKeys: ["service", "parts", "accessories", "finder"] },
] as const;

export const serviceModels = [
  { value: "sealion-06-dmi", label: "Sealion 06 DM-i" },
  { value: "seal-06-dmi", label: "Seal 06 DM-i" },
  { value: "yuan-up-ev", label: "Yuan Up EV" },
  { value: "yuan-up-dmi", label: "Yuan Up DM-i" },
] as const;

export const serviceYears = ["2026", "2025", "2024", "2023", "2022", "2021"] as const;

export const serviceCategories = ["fluids", "filters", "brakes", "suspension", "electrical", "exterior", "interior", "other"] as const;
