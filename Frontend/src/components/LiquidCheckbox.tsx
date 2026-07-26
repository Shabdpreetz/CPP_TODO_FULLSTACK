"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Check } from "lucide-react";

interface LiquidCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
}

export function LiquidCheckbox({ checked, onToggle, label }: LiquidCheckboxProps) {
  const rippleHostRef = useRef<HTMLSpanElement>(null);

  function spawnRipple() {
    const host = rippleHostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ring = document.createElement("span");
    ring.className = "ripple-ring";
    host.appendChild(ring);

    gsap.fromTo(
      ring,
      { scale: 0.4, opacity: 0.55 },
      {
        scale: 2.6,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => ring.remove(),
      },
    );
  }

  function handleClick() {
    if (!checked) spawnRipple();
    onToggle();
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={handleClick}
      className="relative h-6 w-6 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <span
        ref={rippleHostRef}
        className="pointer-events-none absolute -inset-2 overflow-visible"
        aria-hidden
      />
      <span className="absolute inset-0 overflow-hidden rounded-full border border-white/25">
        <motion.span
          className="absolute inset-0 bg-gradient-to-tr from-violet to-cyan"
          style={{ originY: 1 }}
          initial={false}
          animate={{ scaleY: checked ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        />
      </span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center text-bg"
        initial={false}
        animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
        transition={{ duration: 0.16, delay: checked ? 0.09 : 0 }}
      >
        <Check size={13} strokeWidth={3.5} />
      </motion.span>
    </button>
  );
}
