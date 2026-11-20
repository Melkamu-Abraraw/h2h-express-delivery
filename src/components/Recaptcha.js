"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const LOAD_TIMEOUT_MS = 10000;

// Google reCAPTCHA v2 ("I'm not a robot") checkbox.
// Calls onToken(token) when ticked and onToken(null) when it expires or errors.
// Uses the compact size when the space is narrower than the normal widget (304px).
// Renders as soon as Google's script is available (checked directly, so it
// doesn't depend on the script's load event firing for this component).
export default function Recaptcha({ siteKey, hl = "en", onToken, failedText }) {
  const box = useRef(null);
  const widgetId = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    function tryRender() {
      if (cancelled || widgetId.current !== null || !box.current) return;
      const g = window.grecaptcha;
      if (g && typeof g.render === "function") {
        try {
          widgetId.current = g.render(box.current, {
            sitekey: siteKey,
            size: box.current.offsetWidth < 304 ? "compact" : "normal",
            callback: (token) => onToken(token),
            "expired-callback": () => onToken(null),
            "error-callback": () => onToken(null),
          });
        } catch (err) {
          // e.g. already rendered in this element during a fast remount
          console.error("reCAPTCHA render error:", err);
        }
        return;
      }
      if (Date.now() - started > LOAD_TIMEOUT_MS) {
        setFailed(true);
        return;
      }
      setTimeout(tryRender, 200);
    }

    tryRender();
    return () => {
      cancelled = true;
    };
  }, [siteKey, onToken]);

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=explicit&hl=${hl}`}
        strategy="afterInteractive"
      />
      <div ref={box} className="min-h-19.5 w-full" />
      {failed && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {failedText ||
            "The reCAPTCHA check couldn't load. Please check your connection or turn off ad blockers, then reload the page."}
        </p>
      )}
    </>
  );
}
