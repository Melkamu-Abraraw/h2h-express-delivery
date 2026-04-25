import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ServicesGrid from "@/components/ServicesGrid";
import ContactSection from "@/components/ContactSection";
import Testimonialssection from "@/components/Testimonialssection";
import Footer from "@/components/Footer";
import CoverageArea from "@/components/CoverageArea";

// Pass lang as a prop from your i18n setup
export default function Home() {
  return (
    <div>
      <Hero />
      <ServicesGrid />
      <ServicesSection />
      <Testimonialssection />
      <ContactSection />
      <CoverageArea />
      <Footer />
    </div>
  );
}
