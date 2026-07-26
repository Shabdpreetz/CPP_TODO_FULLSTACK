"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { AlertTriangle } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";
import { FilterTabs } from "./FilterTabs";
import { SortMenu } from "./SortMenu";
import { EmptyState } from "./EmptyState";
import {
  createTodo,
  deleteTodo as deleteTodoRequest,
  fetchTodos,
  renameTodo as renameTodoRequest,
  toggleTodo as toggleTodoRequest,
} from "@/lib/api";
import type { Filter, SortOrder, Todo } from "@/lib/types";

export function TodoApp() {
  const panelRef = useRef<HTMLElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTodos()
      .then((data) => {
        if (!cancelled) setTodos(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Can't reach the server. Make sure the C++ backend is running on port 18080.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTodos = useMemo(() => {
    const base =
      filter === "active"
        ? todos.filter((todo) => !todo.completed)
        : filter === "completed"
          ? todos.filter((todo) => todo.completed)
          : todos;

    return [...base].sort((a, b) => (sort === "newest" ? b.id - a.id : a.id - b.id));
  }, [todos, filter, sort]);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  async function handleAdd(title: string) {
    setSubmitting(true);
    setError(null);
    try {
      const todo = await createTodo(title);
      setTodos((prev) => [...prev, todo]);
    } catch {
      setError("Couldn't add that task. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id: number) {
    setError(null);
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    try {
      await toggleTodoRequest(id);
    } catch {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
      setError("Couldn't update that task. Try again.");
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    const previous = todos;
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    try {
      await deleteTodoRequest(id);
    } catch {
      setTodos(previous);
      setError("Couldn't delete that task. Try again.");
    }
  }

  async function handleRename(id: number, title: string) {
    setError(null);
    const previous = todos;
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
    );
    try {
      await renameTodoRequest(id, title);
    } catch {
      setTodos(previous);
      setError("Couldn't rename that task. Try again.");
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    panel.style.setProperty("--shine-x", `${x}%`);
    panel.style.setProperty("--shine-y", `${y}%`);
  }

  function handlePointerLeave() {
    panelRef.current?.style.setProperty("--shine-x", "20%");
    panelRef.current?.style.setProperty("--shine-y", "0%");
  }

  return (
    <section
      ref={panelRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="glass relative z-10 w-full max-w-lg rounded-[32px] p-6 sm:p-8"
    >
      <div
        className="glass-shine pointer-events-none absolute inset-0 rounded-[32px]"
        aria-hidden
      />

      <div className="relative z-10">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Ripple
            </h1>
            <p className="text-sm text-muted">Every done task sends a ripple.</p>
          </div>
          <p className="whitespace-nowrap font-mono text-sm text-muted">
            {completedCount}/{todos.length} done
          </p>
        </header>

        <TodoInput onAdd={handleAdd} submitting={submitting} />

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="my-6 h-px bg-white/10" />

        {loading ? (
          <p className="py-10 text-center text-sm text-muted">
            Loading your tasks…
          </p>
        ) : filteredTodos.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-between">
          <FilterTabs value={filter} onChange={setFilter} />
          <SortMenu value={sort} onChange={setSort} />
        </div>
      </div>
    </section>
  );
}
