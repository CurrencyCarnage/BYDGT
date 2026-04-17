import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GT Group — Official BYD Dealer in Georgia",
  description:
    "Discover BYD electric and hybrid vehicles in Georgia. GT Group is the official BYD reseller offering Sealion 06, Yuan Up, and Seal 06 models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
