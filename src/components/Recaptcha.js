"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// Google reCAPTCHA v2 ("I'm not a robot") checkbox.
// Calls onToken(token) when ticked and onToken(null) when it expires or errors.
// Uses the compact size when the space is narrower than the normal widget (304px).
export default function Recaptcha({ siteKey, hl = "en", onToken }) {
  const box = useRef(null);
  const widgetId = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!ready || !el || widgetId.current !== null || !window.grecaptcha) return;
    window.grecaptcha.ready(() => {
      if (widgetId.current !== null || !box.current) return;
      widgetId.current = window.grecaptcha.render(box.current, {
        sitekey: siteKey,
        size: box.current.offsetWidth < 304 ? "compact" : "normal",
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      });
    });
  }, [ready, siteKey, onToken]);

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=explicit&hl=${hl}`}
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={box} className="min-h-[78px] w-full" />
    </>
  );
}
