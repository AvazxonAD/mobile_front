// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["uz", "en", "ru"],
  defaultLocale: "uz",
  localePrefix: "always", // or "as-needed"
});

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
