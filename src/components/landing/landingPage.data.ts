import type { StaticImageData } from "next/image";

import commercialDesktop from "@/landingpage/commercial-vehicles-desktop.jpg";
import commercialMobile from "@/landingpage/commercial-vehicles-mobile.jpg";
import lightCommercialDesktop from "@/landingpage/lightmode-commercial-vehicles-desktop.jpg";
import lightCommercialMobile from "@/landingpage/lightmode-commercial-vehicles-mobile.jpg";
import lightPassengerDesktop from "@/landingpage/lightmode-passenger-cars-desktop.jpg";
import lightPassengerMobile from "@/landingpage/lightmode-passenger-cars-mobile.jpg";
import lightServicesDesktop from "@/landingpage/lightmode-services-desktop.jpg";
import lightServicesMobile from "@/landingpage/lightmode-services-mobile.jpg";
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
  lightDesktopImage: StaticImageData;
  lightMobileImage: StaticImageData;
  featureKeys: readonly string[];
};

export const landingPanels: readonly LandingPanelDefinition[] = [
  { id: "passenger", number: "01", href: "/cars", desktopImage: passengerDesktop, mobileImage: passengerMobile, lightDesktopImage: lightPassengerDesktop, lightMobileImage: lightPassengerMobile, featureKeys: ["ev", "hybrid", "safety", "technology"] },
  { id: "commercial", number: "02", href: "/commercial", desktopImage: commercialDesktop, mobileImage: commercialMobile, lightDesktopImage: lightCommercialDesktop, lightMobileImage: lightCommercialMobile, featureKeys: ["light", "heavy", "buses", "support"] },
  { id: "services", number: "03", href: "/services", desktopImage: servicesDesktop, mobileImage: servicesMobile, lightDesktopImage: lightServicesDesktop, lightMobileImage: lightServicesMobile, featureKeys: ["service", "parts", "accessories", "finder"] },
] as const;

export type ServicePickerModel = {
  value: string;
  label: string;
  name: string;
  image: string;
  powertrain: "EV" | "PHEV";
  years: number[];
  variants: Array<{ value: string; label: string }>;
};

export const serviceYears = ["2026"] as const;

export const serviceModels = [
  { value: "sealion-06-dmi", label: "Sealion 06 DM-i", name: "BYD Sealion 06 DM-i", image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg", year: 2026 },
  { value: "sealion-06-ev", label: "Sealion 06 EV", name: "BYD Sealion 06 EV", image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg", year: 2026 },
  { value: "seal-06-dmi", label: "Seal 06 DM-i", name: "BYD Seal 06 DM-i", image: "/images/models/seal-06-dmi/hero.jpg", year: 2026 },
  { value: "yuan-up-ev", label: "Yuan Up EV", name: "BYD Yuan Up EV", image: "/images/models/yuan-up-ev/hero.jpg", year: 2026 },
  { value: "yuan-up-dmi", label: "Yuan Up DM-i", name: "BYD Yuan Up DM-i", image: "/images/models/yuan-up-dmi/hero.jpg", year: 2026 },
] as const;

export const serviceCategories = ["fluids", "filters", "brakes", "suspension", "electrical", "exterior", "interior", "other"] as const;
