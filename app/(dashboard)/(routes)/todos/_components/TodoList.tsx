// components/TodoList.tsx

"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { FaSquareCheck } from "react-icons/fa6";
import useTodos from "@/utils/hooks/useTodos";


interface TodoListProps {
  user: User;
}

export default function TodoList({ user }: TodoListProps) {
  const { todos, loading, addTodo, toggleComplete, deleteTodo, updateTodo } = useTodos(user);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

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
        <Button onClick={() => addTodo(newTask)} disabled={loading || newTask.trim() === ""} className="w-full sm:w-auto mt-2 sm:mt-0">
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>

      {/* EMPTY STATE */}
      {todos.length === 0 && (
        <p className="text-center text-gray-500">You have no todos yet. Start by adding a task above!</p>
      )}

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
                      onClick={() => updateTodo(todo.id, editText)}
                      disabled={editText.trim() === todo.task.trim()}
                      className={`px-2 py-1 rounded flex-1 sm:flex-none ${editText.trim() === todo.task.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                    >
                      Update
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded flex-1 sm:flex-none">
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
                <button aria-label="Edit task" onClick={() => { setEditingId(todo.id); setEditText(todo.task); }} className="hover:text-blue-500">
                  <Pencil size={18} />
                </button>
              )}
              <button disabled={loading} aria-label={`Mark ${todo.completed ? "incomplete" : "complete"}`} onClick={() => toggleComplete(todo.id, todo.completed)} className="hover:opacity-75 pl-2">
                <FaSquareCheck className={todo.completed ? "text-green-600" : "text-slate-500"} size={20} />
              </button>
              <button aria-label="Delete task" onClick={() => deleteTodo(todo.id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
