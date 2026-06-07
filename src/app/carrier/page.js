import CarrierForm from "@/components/CarrierForm";

export const metadata = {
  title: "Carrier Registration | H2H Express Delivery",
  description:
    "Travelling and have space? Register to carry packages for H2H Express Delivery.",
  robots: { index: false, follow: false }, // keep this form private
};

export default function CarrierPage() {
  return <CarrierForm />;
}
