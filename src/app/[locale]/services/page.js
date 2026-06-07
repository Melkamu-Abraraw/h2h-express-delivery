import ServicesPage from "@/components/Services";
export const metadata = {
  title: "Our Services | H2H Express",
  description:
    "Explore H2H Express services including traveler-based package delivery, international shipping, and secure logistics solutions.",
  keywords: [
    "delivery services",
    "international shipping",
    "courier service",
    "H2H Express services",
  ],
  openGraph: {
    title: "H2H Express Services",
    description: "Reliable travel-based delivery and logistics solutions.",
    url: "https://yourdomain.com/services",
    images: ["/og-image.jpg"],
  },
};
const Services = () => {
  return <ServicesPage />;
};

export default Services;
