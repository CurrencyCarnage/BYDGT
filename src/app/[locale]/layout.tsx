import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import RoutePreloader from "@/components/ui/RoutePreloader";
import DocumentLang from "@/components/ui/DocumentLang";
import { getAvailableModels } from "@/lib/models";

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

  const [messages, availableModels] = await Promise.all([
    getMessages(),
    getAvailableModels(),
  ]);
  const productMenuModels = availableModels.map(({ id, name, tagline, type, images }) => ({
    id,
    name,
    tagline,
    type,
    images: {
      hero: images.hero,
      gallery: images.gallery,
    },
  }));

  return (
    <div lang={locale} className="contents">
      <DocumentLang locale={locale} />
      <NextIntlClientProvider messages={messages}>
        <Navbar models={productMenuModels} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
        <RoutePreloader />
      </NextIntlClientProvider>
    </div>
  );
}
