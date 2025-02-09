"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { FaSquareCheck } from "react-icons/fa6";

interface Todo {
  id: string;
  user_id: string;
  task: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TodoListProps {
  user: User;
}

export default function TodoList({ user }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const supabase = useMemo(() => createClient(), []);

  // Fetch Todos (Runs once when component mounts)
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
  }, [user.id, supabase]);

  // Add a new task
  const addTodo = useCallback(async () => {
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
  }, [newTask, supabase, user.id]);

  // Toggle task completion
  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    const { error } = await supabase.from("todos").update({ completed: !completed }).eq("id", id);

    if (error) console.error("Error updating task:", error);
    else setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)));
  }, [supabase]);

  // Delete a task
  const deleteTodo = useCallback(async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) console.error("Error deleting task:", error);
    else setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, [supabase]);

  // Start editing a task
  const startEditing = useCallback((id: string, task: string) => {
    setEditingId(id);
    setEditText(task);
  }, []);

  // Update a task
  const updateTodo = useCallback(async (id: string) => {
    if (!editText.trim()) return;
    const { error } = await supabase.from("todos").update({ task: editText }).eq("id", id);

    if (error) console.error("Error updating task:", error);
    else {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, task: editText } : todo)));
      setEditingId(null);
    }
  }, [editText, supabase]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-full sm:max-w-md lg:max-w-lg mx-auto px-2 sm:px-4">
      <h2 className="text-xl font-bold text-center">Your To-Do List</h2>

      {/* NEW TASK INPUT */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1"
        />
        <Button onClick={addTodo} disabled={loading || newTask.trim() === ""} className="w-full sm:w-auto mt-2 sm:mt-0">
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>

      {/* TODO LIST */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-md bg-gray-100 dark:bg-gray-800"
          >
            <div className="flex-1 min-w-0 mb-2 sm:mb-0">
              {editingId === todo.id ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border px-2 py-1 flex-1 rounded-md focus:outline-none focus:border-green-400 dark:bg-gray-700 dark:text-white mb-2 sm:mb-0"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateTodo(todo.id)}
                      disabled={editText.trim() === todo.task.trim()}
                      className={`px-2 py-1 rounded flex-1 sm:flex-none ${editText.trim() === todo.task.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded flex-1 sm:flex-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <span className={`truncate block ${todo.completed ? "line-through text-gray-500" : ""}`}>
                  {todo.task}
                </span>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-start">
              {editingId !== todo.id && (
                <button onClick={() => startEditing(todo.id, todo.task)} className="hover:text-blue-500">
                  <Pencil size={18} />
                </button>
              )}
              <button onClick={() => toggleComplete(todo.id, todo.completed)} className="hover:opacity-75 pl-2">
                {todo.completed ? (
                  <FaSquareCheck className="text-green-600" size={20} />
                ) : (
                  <FaSquareCheck className="text-slate-500" size={20} />
                )}
              </button>
              <button onClick={() => deleteTodo(todo.id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
