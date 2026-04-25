import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ar", "am"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(en|ar|am)/:path*"],
};
