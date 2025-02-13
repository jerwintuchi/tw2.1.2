"user client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Todo {
  id: string;
  user_id: string;
  task: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function useTodos(user: User) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  // Fetch Todos
  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching todos:", error);
      else setTodos(data || []);
    }

    fetchTodos();
  }, [user.id, supabase]);

  // Add a new task
  const addTodo = useCallback(
    async (task: string) => {
      if (!task.trim()) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("todos")
        .insert([{ task, completed: false, user_id: user.id }])
        .select()
        .single();

      if (error) console.error("Error adding task:", error);
      else setTodos((prev) => [data, ...prev]);

      setLoading(false);
    },
    [supabase, user.id]
  );

  // Toggle task completion
  const toggleComplete = useCallback(
    async (id: string, completed: boolean) => {
      const { error } = await supabase
        .from("todos")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) console.error("Error updating task:", error);
      else
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
    },
    [supabase]
  );

  // Delete a task
  const deleteTodo = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) console.error("Error deleting task:", error);
      else setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [supabase]
  );

  // Update a task
  const updateTodo = useCallback(
    async (id: string, newTask: string) => {
      if (!newTask.trim()) return;
      const { error } = await supabase
        .from("todos")
        .update({ task: newTask })
        .eq("id", id);

      if (error) console.error("Error updating task:", error);
      else
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, task: newTask } : todo
          )
        );
    },
    [supabase]
  );

  return {
    todos,
    loading,
    addTodo,
    toggleComplete,
    deleteTodo,
    updateTodo,
  };
}
