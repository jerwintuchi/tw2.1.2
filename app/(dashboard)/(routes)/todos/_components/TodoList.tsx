"use client";

import React, { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Todo {
  id: string; // UUID
  user_id: string;
  task: string;
  completed: boolean;
  created_at: string;
}

interface TodoListProps {
  user: User;
}

export default function TodoList({ user }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // Fetch user's to-dos
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching todos:", error);
      else setTodos(data || []);
    };

    fetchTodos();
  }, [user.id]);

  // Add new to-do
  const addTodo = async () => {
    if (!newTask.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("todos")
      .insert([{ task: newTask, completed: false, user_id: user.id }])
      .select()
      .single();

    if (error) console.error("Error adding task:", error);
    else setTodos((prev) => [data, ...prev]);

    setNewTask("");
    setLoading(false);
  };

  // Toggle completion
  const toggleComplete = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);

    if (error) console.error("Error updating task:", error);
    else
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo))
      );
  };

  // Delete to-do
  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) console.error("Error deleting task:", error);
    else setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold">Your To-Do List</h2>

      {/* Input for adding tasks */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1"
        />
        <Button onClick={addTodo} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>

      {/* To-do list */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-3 border rounded-md bg-gray-100 dark:bg-gray-800"
          >
            <span
              className={`flex-1 ${todo.completed ? "line-through text-gray-500" : ""}`}
            >
              {todo.task}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => toggleComplete(todo.id, todo.completed)}
                className="text-green-600 hover:text-green-800"
              >
                <CheckCircle size={20} />
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
