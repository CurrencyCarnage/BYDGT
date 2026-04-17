import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import enMessages from "../lib/i18n/en.json";
import kaMessages from "../lib/i18n/ka.json";

const messages: Record<string, object> = {
  en: enMessages,
  ka: kaMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "ka")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale],
  };
});
