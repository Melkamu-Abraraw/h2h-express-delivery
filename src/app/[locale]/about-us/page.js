import About from "@/components/About";
export const metadata = {
  title: "About Us | H2H Express",
  description:
    "Learn more about H2H Express, our mission, values, and how we connect travelers with secure package delivery worldwide.",
  keywords: ["about H2H Express", "delivery company", "travel courier service"],
  openGraph: {
    title: "About H2H Express",
    description: "Learn more about our mission and trusted delivery network.",
    url: "https://yourdomain.com/about",
    type: "website",
    images: ["/og-image.jpg"],
  },
};

const AboutPage = () => {
  return <About />;
};

export default AboutPage;
