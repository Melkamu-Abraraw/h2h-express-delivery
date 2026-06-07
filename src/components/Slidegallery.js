"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  {
    id: 7,
    image: "/images/hapi_4.jpeg",
  },
  {
    id: 1,
    image: "/images/slide_1.png",
  },
  {
    id: 2,
    image: "/images/slide_2.png",
  },
  {
    id: 3,
    image: "/images/slide_3.png",
  },
  {
    id: 5,
    image: "/images/selam_2.JPG",
  },
  {
    id: 4,
    image: "/images/slide_4.png",
  },
  {
    id: 6,
    image: "/images/hapi_3.jpeg",
  },
  {
    id: 6,
    image: "/images/h2h2.jpg",
  },
];

export default function SlideGallery() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  const goTo = useCallback(
    (index, dir = "next") => {
      if (animating || index === current) return;

      setDirection(dir);
      setPrev(current);
      setAnimating(true);
      setCurrent(index);

      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 600);
    },
    [animating, current],
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, "next");
  }, [current, goTo]);

  const goBack = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, "prev");
  }, [current, goTo]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(next, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  return (
    <div
      className="relative max-w-7xl mx-auto px-1 rounded-2xl overflow-hidden"
      style={{ aspectRatio: "16/9" }}
    >
      {SLIDES.map((s, i) => {
        const isActive = i === current;
        const isPrev = i === prev;

        if (!isActive && !isPrev) return null;

        return (
          <div
            key={s.id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              zIndex: isActive ? 2 : 1,
              opacity: isPrev ? 0 : 1,
              transform: isPrev
                ? direction === "next"
                  ? "translateX(-3%)"
                  : "translateX(3%)"
                : "translateX(0)",
            }}
          >
            {/* Blurred background */}
            <div
              className="absolute inset-0 scale-110 blur-2xl"
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />

            {/* Main image */}
            <img
              src={s.image}
              alt={`Slide ${i + 1}`}
              className="relative z-10 w-full h-full object-contain"
              draggable={false}
            />
          </div>
        );
      })}

      {/* Prev button */}
      <button
        onClick={goBack}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
        aria-label="Previous"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
        aria-label="Next"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 3L11 8L6 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              backgroundColor:
                i === current ? "white" : "rgba(255,255,255,0.5)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
