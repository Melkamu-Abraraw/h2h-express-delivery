import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import Header from "@/components/common/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={inter.variable}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
