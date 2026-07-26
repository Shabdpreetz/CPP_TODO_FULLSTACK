import axios from "axios";
import type { Todo } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:18080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export async function fetchTodos(): Promise<Todo[]> {
  const { data } = await api.get<{ todos: Todo[] }>("/todos");
  return data.todos;
}

export async function createTodo(title: string): Promise<Todo> {
  const { data } = await api.post<Todo>("/todos", { title });
  return data;
}

export async function renameTodo(id: number, title: string): Promise<Todo> {
  const { data } = await api.put<Todo>(`/todos/${id}`, { title });
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}

export async function toggleTodo(id: number): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/todos/${id}/toggle`);
  return data;
}
