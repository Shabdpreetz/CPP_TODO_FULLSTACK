"use client";

import { AnimatePresence } from "framer-motion";
import { TodoItem } from "./TodoItem";
import type { Todo } from "@/lib/types";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onRename: (id: number, title: string) => void;
}

export function TodoList({ todos, onToggle, onDelete, onRename }: TodoListProps) {
  return (
    <ul className="todo-scroll flex max-h-[21rem] flex-col gap-2 overflow-y-auto pr-1">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => onToggle(todo.id)}
            onDelete={() => onDelete(todo.id)}
            onRename={(title) => onRename(todo.id, title)}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
