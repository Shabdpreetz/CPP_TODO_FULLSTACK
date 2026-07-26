"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const blobs = [
  { className: "bg-violet", size: 620, top: "-10%", left: "-8%" },
  { className: "bg-cyan", size: 560, top: "36%", left: "56%" },
  { className: "bg-coral", size: 500, top: "-6%", left: "60%" },
  { className: "bg-violet", size: 460, top: "56%", left: "-10%" },
];

export function LiquidBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = container.querySelectorAll<HTMLDivElement>("[data-blob]");
    const tweens = Array.from(elements).map((el, i) =>
      gsap.to(el, {
        x: (i % 2 === 0 ? 1 : -1) * (70 + i * 24),
        y: (i % 2 === 0 ? -1 : 1) * (60 + i * 20),
        scale: 1.15,
        duration: 16 + i * 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      }),
    );

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
      aria-hidden
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          data-blob
          className={`absolute rounded-full opacity-70 blur-[100px] mix-blend-screen ${blob.className}`}
          style={{ width: blob.size, height: blob.size, top: blob.top, left: blob.left }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-bg)_92%)]" />
    </div>
  );
}
