// components/CoverageArea.jsx
import Image from "next/image";

export default function CoverageArea() {
  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left: Text content */}
        <div className="flex-1 max-w-lg">
          <span className="inline-block bg-[rgb(var(--color-brand))] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            Coverage Area
          </span>

          <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
            Our coverage area
          </h2>

          <p className="text-gray-500 text-base leading-relaxed mb-8">
            We serve thousands of lanes across the Canada & Ethiopia. When your
            network aligns with ours, you gain access to our dependable service
            and competitive pricing. We offer Intermodal shipping within our
            coverage areas.
          </p>
        </div>

        {/* Right: Map image */}
        <div className="flex-1 flex justify-center items-center">
          <Image
            src="/images/delivery-destinations-image.png"
            alt="Coverage area map showing service locations"
            width={500}
            height={400}
            className="w-full max-w-xl object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 2v8M5 7l3 3 3-3M3 13h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
