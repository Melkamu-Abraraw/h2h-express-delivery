import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ServicesGrid from "@/components/ServicesGrid";
import Testimonialssection from "@/components/Testimonialssection";
import Footer from "@/components/Footer";
import CoverageArea from "@/components/CoverageArea";
import TrustedPartners from "@/components/TrustedPartners";
// Pass lang as a prop from your i18n setup
export default function Home() {
  return (
    <div>
      <Hero />
      <TrustedPartners />
      <ServicesGrid />
      <ServicesSection />
      <Testimonialssection />
      <CoverageArea />
    </div>
  );
}
