// tests/useTodos.test.tsx
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import useTodos from "../../../utils/hooks/useTodos";
import type { User } from "@supabase/supabase-js";

// Mock Supabase Client
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({
            data: [], //  Ensure it starts empty
            error: null,
          }),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              id: "456",
              task: "New Task",
              completed: false,
              user_id: "user-123",
            }, //  Return only new task
            error: null,
          }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(async (_, id) => ({
          data: [{ id, task: "Task", completed: true }],
          error: null,
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
  })),
}));

// Mock User
const mockUser: User = {
  id: "user-123",
  aud: "authenticated",
  role: "authenticated",
  email: "test@example.com",
  app_metadata: {},
  user_metadata: {},
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Reset Mocks Before Each Test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("useTodos Hook", () => {
  it("should initialize with an empty list", async () => {
    const { result } = renderHook(() => useTodos(mockUser));

    expect(result.current.todos).toEqual([]); // Should start empty
  });

  it("should add a new todo", async () => {
    const { result } = renderHook(() => useTodos(mockUser));

    expect(result.current.todos).toHaveLength(0); // Ensure to start with an empty list

    await act(async () => {
      await result.current.addTodo("New Task");
    });

    await waitFor(() => {
      expect(result.current.todos).toHaveLength(1); //  contains only 1 new todo
      expect(result.current.todos[0]).toMatchObject({
        id: "456",
        task: "New Task",
        completed: false,
        user_id: "user-123",
      });
    });
  });

  it("should toggle a todo's completed state", async () => {
    const { result } = renderHook(() => useTodos(mockUser));

    await act(async () => {
      await result.current.addTodo("Toggle Task");
    });

    const todoId = result.current.todos[0].id;
    const initialCompleted = result.current.todos[0].completed;

    // Toggle completed and wait for state update
    await act(async () => {
      await result.current.toggleComplete(todoId, initialCompleted);
    });

    await waitFor(() => {
      expect(result.current.todos[0].completed).toBe(!initialCompleted);
    });

    // Toggle back and wait for state update
    await act(async () => {
      await result.current.toggleComplete(todoId, !initialCompleted);
    });

    await waitFor(() => {
      expect(result.current.todos[0].completed).toBe(initialCompleted);
    });
  });

  it("should update a todo's task", async () => {
    const { result } = renderHook(() => useTodos(mockUser));

    await act(async () => {
      await result.current.addTodo("Old Task");
    });

    const todoId = result.current.todos[0].id;

    await act(async () => {
      await result.current.updateTodo(todoId, "Updated Task");
    });

    expect(result.current.todos[0].task).toBe("Updated Task");
  });

  it("should remove a todo", async () => {
    const { result } = renderHook(() => useTodos(mockUser));

    await act(async () => {
      await result.current.addTodo("Task to Remove");
    });

    const todoId = result.current.todos[0].id;

    await act(async () => {
      await result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });
});
