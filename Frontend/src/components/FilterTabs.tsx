"use client";

import { motion } from "framer-motion";
import type { Filter } from "@/lib/types";

const options: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
];

interface FilterTabsProps {
  value: Filter;
  onChange: (filter: Filter) => void;
}

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active ? "text-bg" : "text-muted hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet to-cyan"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
