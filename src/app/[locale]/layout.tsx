import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import RoutePreloader from "@/components/ui/RoutePreloader";

// BYD spec: Montserrat is the single authorised font for English/European locales
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const ASSET_V = "20260503a";
const WHEEL_SPRITE_MODELS = ["sealion-06-dmi", "seal-06-dmi", "yuan-up-ev", "yuan-up-dmi"];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as "en" | "ka")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={montserrat.variable}>
      <head>
        {/* Preload wheel sprites so they're cached before ModelShowcase scrolls into view */}
        {WHEEL_SPRITE_MODELS.flatMap((id) => [
          <link key={`${id}-f`} rel="preload" as="image" href={`/images/homepage/mapped-wheels/${id}-front.png?v=${ASSET_V}`} />,
          <link key={`${id}-r`} rel="preload" as="image" href={`/images/homepage/mapped-wheels/${id}-rear.png?v=${ASSET_V}`} />,
        ])}
      </head>
      <body className="font-sans antialiased bg-byd-dark text-white min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <RoutePreloader />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
