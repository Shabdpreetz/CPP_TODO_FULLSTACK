"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus } from "lucide-react";

interface TodoInputProps {
  onAdd: (title: string) => void;
  submitting: boolean;
}

export function TodoInput({ onAdd, submitting }: TodoInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    onAdd(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="What needs doing?"
        aria-label="New task"
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
      />
      <motion.button
        type="submit"
        disabled={!value.trim() || submitting}
        whileTap={{ scale: 0.92 }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet to-cyan text-bg shadow-lg shadow-violet/20 disabled:opacity-40"
        aria-label="Add task"
      >
        {submitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Plus size={20} />
        )}
      </motion.button>
    </form>
  );
}
