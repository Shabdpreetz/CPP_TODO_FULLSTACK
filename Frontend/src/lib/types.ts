export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export type Filter = "all" | "active" | "completed";

export type SortOrder = "newest" | "oldest";
