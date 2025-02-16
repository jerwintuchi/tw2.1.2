import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import Login from "@/app/(auth)/sign-in/page";
import { signInAction } from "@/app/actions";
import "@testing-library/jest-dom/vitest";

// Mock signInAction since it's a server function
vi.mock("@/app/actions", () => ({
  signInAction: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => {
  cleanup(); // Make sure previous renders are cleaned up
});
describe("Login Page", () => {
  it("renders the login form correctly", async () => {
    const searchParams = Promise.resolve({ type: "", path: "", message: "" });
    const LoginPage = await Login({ searchParams });

    render(LoginPage);

    // Wait for the elements to be rendered in the document
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /sign in/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByTestId("sign-in-btn")).toBeInTheDocument();
    });
  });
});

it("calls signInAction when form is submitted", async () => {
  const searchParams = Promise.resolve({ type: "", path: "", message: "" });
  const LoginPage = await Login({ searchParams });

  render(LoginPage);

  await waitFor(() => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("sign-in-btn"));
  });

  expect(signInAction).toHaveBeenCalled(); //  Correctly verify if signInAction was called
});
