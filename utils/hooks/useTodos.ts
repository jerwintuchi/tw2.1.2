import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { showPromiseToast } from "@/components/toasts/PromiseToast";
import showSuccessToast from "@/components/toasts/SuccessToast";
import showErrorToast from "@/components/toasts/ErrorToast";

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

      if (error) {
        console.error("Error fetching todos:", error);
        showErrorToast({ message: "Failed to load tasks!" });
      } else {
        setTodos(data || []);
      }
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

      if (error) {
        console.error("Error adding task:", error);
        showErrorToast({ message: "Failed to add task!" });
      } else {
        setTodos((prev) => [data, ...prev]);
        showSuccessToast({ message: "Task added successfully!" });
      }

      setLoading(false);
    },
    [supabase, user.id]
  );

  // Toggle task completion
  const toggleComplete = useCallback(
    async (id: string, completed: boolean) => {
      const { error, data: updatedTodos } = await supabase
        .from("todos")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) {
        console.error("Error updating task:", error);
        showErrorToast({ message: "Failed to update task!" });
      } else {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
        showSuccessToast({ message: "Task status updated!" });
      }
    },
    [supabase]
  );

  // Delete a task
  const deleteTodo = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) {
        console.error("Error deleting task:", error);
        showErrorToast({ message: "Failed to delete task!" });
      } else {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        showSuccessToast({ message: "Task deleted successfully!" });
      }
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

      if (error) {
        console.error("Error updating task:", error);
        showErrorToast({ message: "Failed to update task!" });
      } else {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, task: newTask } : todo
          )
        );
        showSuccessToast({ message: "Task updated successfully!" });
      }
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
