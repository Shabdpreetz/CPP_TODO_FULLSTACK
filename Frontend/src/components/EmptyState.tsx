import type { Filter } from "@/lib/types";

const copy: Record<Filter, { title: string; body: string }> = {
  all: {
    title: "Still as glass.",
    body: "Add your first task and watch it ripple through.",
  },
  active: {
    title: "Nothing active.",
    body: "Every task is done — nice work.",
  },
  completed: {
    title: "Nothing completed yet.",
    body: "Check off a task to see it here.",
  },
};

export function EmptyState({ filter }: { filter: Filter }) {
  const { title, body } = copy[filter];
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="text-sm text-muted">{body}</p>
    </div>
  );
}
