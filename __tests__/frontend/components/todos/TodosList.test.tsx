import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import TodoList from "../../../../app/(dashboard)/(routes)/todos/_components/TodoList";
import useTodos from "@/utils/hooks/useTodos";
import { User } from "@supabase/supabase-js";
import "@testing-library/jest-dom/vitest";


// Mock useTodos hook
vi.mock("@/utils/hooks/useTodos", () => {
  return {
    default: vi.fn(() => ({
      todos: [],
      loading: false,
      addTodo: vi.fn(),
      toggleComplete: vi.fn(),
      deleteTodo: vi.fn(),
      updateTodo: vi.fn(),
    })),
  };
});

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
} as User;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TodoList Component", () => {
  it("should render the component correctly", () => {

    render(<TodoList user={mockUser} />);

    expect(screen.getByText("Your To-Do List")).toBeInTheDocument();
  });

  it("should add a new todo", async () => {
    const mockAddTodo = vi.fn();
    (useTodos as Mock).mockReturnValue({
      todos: [],
      loading: false,
      addTodo: mockAddTodo,
    });

    render(<TodoList user={mockUser} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith("New Task");
    });
  });

  it("should toggle completion status", async () => {
    const mockToggleComplete = vi.fn();
    (useTodos as Mock).mockReturnValue({
      todos: [{ id: "todo-1", task: "Test Task", completed: false }],
      toggleComplete: mockToggleComplete,
    });

    render(<TodoList user={mockUser} />);
    const completeButton = screen.getByRole("button", { name: /Mark complete/i });
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockToggleComplete).toHaveBeenCalledWith("todo-1", false);
    });
  });

  it("should delete a todo", async () => {
    const mockDeleteTodo = vi.fn();
    (useTodos as Mock).mockReturnValue({
      todos: [{ id: "todo-1", task: "Task to delete", completed: false }],
      deleteTodo: mockDeleteTodo,
    });

    render(<TodoList user={mockUser} />);

    const deleteButton = screen.getByRole("button", { name: /delete task/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith("todo-1");
    });
  });

  it("should update a todo", async () => {
    const mockUpdateTodo = vi.fn();
    (useTodos as Mock).mockReturnValue({
      todos: [{ id: "todo-1", task: "Old Task", completed: false }],
      updateTodo: mockUpdateTodo,
    });

    render(<TodoList user={mockUser} />);

    const editButton = screen.getByRole("button", { name: /edit task/i });
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue("Old Task");
    fireEvent.change(input, { target: { value: "Updated Task" } });
    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith("todo-1", "Updated Task");
    });
  });

  it("should not add an empty todo", async () => {
    const mockAddTodo = vi.fn();
    (useTodos as Mock).mockReturnValue({
      todos: [],
      loading: false,
      addTodo: mockAddTodo,
    });

    render(<TodoList user={mockUser} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddTodo).not.toHaveBeenCalled();
    });
  });

  it("should not toggle completion when loading", async () => {
    const mockToggleComplete = vi.fn();
    (useTodos as Mock).mockReturnValue({
      todos: [{ id: "todo-1", task: "Test Task", completed: false }],
      loading: true, // Ensure loading is true here
      toggleComplete: mockToggleComplete,
    });

    render(<TodoList user={mockUser} />);

    const completeButton = screen.getByRole("button", { name: /Mark complete/i });
    fireEvent.click(completeButton);

    await waitFor(() => {
      // Make sure the toggleComplete function is NOT called
      expect(mockToggleComplete).not.toHaveBeenCalled();
    });
  });


});
