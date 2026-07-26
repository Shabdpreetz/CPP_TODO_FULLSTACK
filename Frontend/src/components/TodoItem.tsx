"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { LiquidCheckbox } from "./LiquidCheckbox";
import type { Todo } from "@/lib/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onRename }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function startEditing() {
    setDraft(todo.title);
    setIsEditing(true);
  }

  function commit() {
    const trimmed = draft.trim();
    setIsEditing(false);
    if (trimmed && trimmed !== todo.title) {
      onRename(trimmed);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      setDraft(todo.title);
      setIsEditing(false);
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors hover:border-white/10 hover:bg-white/[0.06]"
    >
      <LiquidCheckbox
        checked={todo.completed}
        onToggle={onToggle}
        label={`Mark "${todo.title}" as ${todo.completed ? "active" : "done"}`}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          aria-label={`Edit "${todo.title}"`}
          className="min-w-0 flex-1 rounded-lg border border-violet/40 bg-white/5 px-2 py-1 text-[15px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
        />
      ) : (
        <span
          onDoubleClick={startEditing}
          className={`min-w-0 flex-1 truncate text-[15px] transition-colors ${
            todo.completed ? "text-muted line-through" : "text-ink"
          }`}
        >
          {todo.title}
        </span>
      )}

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={startEditing}
          aria-label={`Edit "${todo.title}"`}
          className="rounded-lg border border-white/15 bg-white/10 p-1.5 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:border-cyan/40 hover:bg-cyan/20 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete "${todo.title}"`}
          className="rounded-lg border border-white/15 bg-white/10 p-1.5 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:border-coral/40 hover:bg-coral/20 hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.li>
  );
}
