import { Bricolage_Grotesque, Poppins } from "next/font/google";
import BuyForMe from "@/components/BuyForMe";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Used for the hero title only (variable font: weight, optical size, width).
const heroFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero",
  // Load the optical-size axis so the title can use the tighter
  // display letterforms even at small sizes.
  axes: ["opsz"],
});

export const metadata = {
  title: "Buy for Me | H2H Express",
  description:
    "Send us a product link from any Canadian store. H2H Express buys it for you and delivers it to your door in Ethiopia.",
  keywords: [
    "buy for me Canada Ethiopia",
    "shop in Canada ship to Ethiopia",
    "personal shopper Canada",
    "H2H Express buy for me",
  ],
  openGraph: {
    title: "Buy for Me | H2H Express",
    description:
      "We shop in Canada, you receive it in Ethiopia. Send us the link and we handle the rest.",
    images: ["/images/buy-for-me-banner.png"],
  },
};

export default function BuyForMePage() {
  return (
    <div className={`${poppins.className} ${heroFont.variable}`}>
      <BuyForMe />
    </div>
  );
}
