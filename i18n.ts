import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "./app/routing";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? routing.defaultLocale;

  if (!routing.locales.includes(resolvedLocale as any)) notFound();

  return {
    locale: resolvedLocale,
    messages: (await import(`./app/messages/${resolvedLocale}.json`)).default,
  };
});
