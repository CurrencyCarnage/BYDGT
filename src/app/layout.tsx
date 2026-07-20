import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// BYD spec: Montserrat is the single authorised font for English/European locales.
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GT Group - Official BYD Dealer in Georgia",
  description:
    "Discover BYD electric and hybrid vehicles in Georgia. GT Group is the official BYD reseller offering Sealion 06, Yuan Up, and Seal 06 products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem("byd-theme");
                document.documentElement.classList.toggle("light", theme === "light");
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-byd-dark text-white min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
