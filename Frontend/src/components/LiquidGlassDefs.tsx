"use client";

import { useEffect } from "react";

/**
 * Feature-detects real backdrop-filter + SVG url() support before opting in.
 * Browsers that reject the syntax leave `style.backdropFilter` empty, so we
 * never risk breaking the plain blur fallback defined in globals.css.
 */
export function LiquidGlassDefs() {
  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.backdropFilter = "url(#liquid-glass-distortion) blur(1px)";
    if (probe.style.backdropFilter !== "") {
      document.documentElement.classList.add("supports-glass-distortion");
    }
  }, []);

  return (
    <svg aria-hidden className="absolute h-0 w-0 overflow-hidden">
      <filter id="liquid-glass-distortion" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.012"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softNoise"
          scale="16"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
