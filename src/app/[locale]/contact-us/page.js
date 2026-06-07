import React from "react";
import ContactSection from "@/components/ContactSection";
export const metadata = {
  title: "Contact Us | H2H Express",
  description:
    "Get in touch with H2H Express for support, partnerships, or delivery inquiries.",
  keywords: ["contact H2H Express", "customer support", "delivery contact"],
  openGraph: {
    title: "Contact H2H Express",
    description: "Reach out to our support team anytime.",
    url: "https://yourdomain.com/contact",
    images: ["/og-image.jpg"],
  },
};
const Contact = () => {
  return (
    <div>
      <ContactSection />
    </div>
  );
};

export default Contact;
