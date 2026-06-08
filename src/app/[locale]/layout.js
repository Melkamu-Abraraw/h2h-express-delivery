import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/common/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = "https://handtohandexpress.com/en";

const META = {
  en: {
    title: "H2H Express Delivery | Canada to Ethiopia Courier",
    description:
      "Fast, reliable door-to-door express delivery from Canada to Ethiopia. " +
      "Track shipments and send packages to Addis Ababa with H2H Express.",
    dir: "ltr",
    locale: "en_CA",
  },
  am: {
    title: "H2H ኤክስፕረስ | ከካናዳ ወደ ኢትዮጵያ የፍጥነት መላኪያ አገልግሎት",
    description:
      "ፈጣን ከደጃፍ እስከ ደጃፍ የጭነት አደራረስ አገልግሎት ከካናዳ ወደ ኢትዮጵያ። H2H ኤክስፕረስ ወደ አዲስ አበባ ይላኩ።",
    dir: "ltr",
    locale: "am_ET",
  },
  ti: {
    title: "H2H ኤክስፕረስ | ካብ ካናዳ ናብ ኢትዮጵያ ናይ ምብጻሕ ኣገልግሎት",
    description:
      "ቅልጡፍ ካብ ማዕጾ ናብ ማዕጾ ናይ ምብጻሕ ኣገልግሎት ካብ ካናዳ ናብ ኢትዮጵያ። H2H ኤክስፕረስ ናብ ኣዲስ ኣበባ ይሰዱ።",
    dir: "ltr",
    locale: "ti_ET",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "MovingCompany"],
  name: "H2H Express Delivery",
  alternateName: "H2H Delivery Inc.",
  description:
    "Door-to-door express courier service from Canada to Ethiopia, specializing in fast parcel delivery to Addis Ababa.",
  url: `${BASE_URL}/en`,
  telephone: "+1 437 997 7533",
  email: "h2hexp2025@gmail.com",
  logo: `${BASE_URL}/H2H_Logo.png`,
  image: `${BASE_URL}/H2H_Logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "2017 Danforth Ave",
    addressLocality: "Toronto",
    addressRegion: "ON",
    postalCode: "M4C 1J7",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.685251091001554,
    longitude: -79.31373456198583,
  },
  areaServed: [
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Ethiopia" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Delivery Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Express Delivery Canada to Ethiopia",
          description:
            "Fast door-to-door parcel delivery from Canada to Addis Ababa, Ethiopia.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Package Tracking",
          description:
            "Real-time tracking for all shipments from Canada to Ethiopia.",
        },
      },
    ],
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const m = META[locale] ?? META.en;

  return {
    title: m.title,
    description: m.description,
    keywords: [
      "express delivery Canada Ethiopia",
      "courier Canada to Ethiopia",
      "shipping from Canada to Ethiopia",
      "parcel delivery Addis Ababa",
      "H2H Express delivery",
      "Ethiopian diaspora shipping Canada",
      "hand to hand delivery Canada",
    ],
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${BASE_URL}/${locale}`,
      siteName: "H2H Express Delivery",
      locale: m.locale,
      type: "website",
      images: [
        {
          url: `${BASE_URL}/H2H_Logo.png`,
          width: 1200,
          height: 630,
          alt: "H2H Express Delivery – Canada to Ethiopia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        am: `${BASE_URL}/am`,
        ti: `${BASE_URL}/ti`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const m = META[locale] ?? META.en;

  return (
    <html lang={locale} dir={m.dir} className={inter.variable}>
      <body className={inter.className}>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
