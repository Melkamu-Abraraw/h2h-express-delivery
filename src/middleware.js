import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ti", "am"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(en|ti|am)/:path*"],
};
