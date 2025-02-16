import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import Signup from "@/app/(auth)/sign-up/page";
import { signUpAction } from "@/app/actions";
import "@testing-library/jest-dom/vitest";
import { Message } from "@/components/form-message";

vi.mock("@/app/actions", () => ({
  signUpAction: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe("SignUp Page", () => {
  it("renders the signup form correctly with empty message", async () => {
    const searchParams = Promise.resolve({
      message: "",
    } as Message);

    const SignupPage = await Signup({ searchParams });
    render(SignupPage);

    await waitFor(() => {
      expect(screen.getByTestId("sign-up-title")).toBeInTheDocument();
      expect(screen.getByTestId("username-field")).toBeInTheDocument();
      expect(screen.getByTestId("email-field")).toBeInTheDocument();
      expect(screen.getByTestId("password-field")).toBeInTheDocument();
      expect(screen.getByTestId("sign-up-btn")).toBeInTheDocument();
    });
  });

  it("displays success message when provided while keeping form visible", async () => {
    const searchParams = Promise.resolve({
      success: "Success message",
    } as Message);

    const SignupPage = await Signup({ searchParams });
    render(SignupPage);

    await waitFor(() => {
      // Form should still be visible
      expect(screen.getByTestId("sign-up-title")).toBeInTheDocument();
      expect(screen.getByTestId("username-field")).toBeInTheDocument();
      // Message should be visible
      expect(screen.getByText("Success message")).toBeInTheDocument();
    });
  });

  it("displays error message when provided while keeping form visible", async () => {
    const searchParams = Promise.resolve({
      error: "Error message",
    } as Message);

    const SignupPage = await Signup({ searchParams });
    render(SignupPage);

    await waitFor(() => {
      // Form should still be visible
      expect(screen.getByTestId("sign-up-title")).toBeInTheDocument();
      expect(screen.getByTestId("username-field")).toBeInTheDocument();
      // Message should be visible
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });

  it("displays info message when provided while keeping form visible", async () => {
    const searchParams = Promise.resolve({
      message: "Info message",
    } as Message);

    const SignupPage = await Signup({ searchParams });
    render(SignupPage);

    await waitFor(() => {
      // Form should still be visible
      expect(screen.getByTestId("sign-up-title")).toBeInTheDocument();
      expect(screen.getByTestId("username-field")).toBeInTheDocument();
      // Message should be visible
      expect(screen.getByText("Info message")).toBeInTheDocument();
    });
  });

  it("calls signUpAction when form is submitted", async () => {
    const searchParams = Promise.resolve({
      message: "",
    } as Message);

    const SignupPage = await Signup({ searchParams });
    render(SignupPage);

    fireEvent.change(screen.getByTestId("username-field"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("email-field"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-field"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("sign-up-btn"));

    await waitFor(() => {
      expect(signUpAction).toHaveBeenCalled();
    });
  });
});
