import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "../../components/theme-provider";
import { Toaster } from "../../components/ui/toaster";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: {
    default: "RAQAMLI DUNYODA MA'NAVIY TARBIYANI ASRASH",
    template: "%s | Ma'naviy Tarbiya",
  },
  description:
    "Hozirgi kunda yoshlar ko'p vaqtini internetda, ijtimoiy tarmoqlarda o'tkazmoqda. Bu ularning axloqiy, ma'naviy va psixologik rivojlanishiga bevosita ta'sir qilmoqda. Bu loyiha - RAQAMLI hayot bilan real ma'naviy qadriyatlar o'rtasidagi ko'prik vazifasini bajaradi.",
  generator: "Next.js",
  applicationName: "Ma'naviy Tarbiya",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
