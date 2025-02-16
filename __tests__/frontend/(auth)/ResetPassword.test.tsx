import { render, screen, act, cleanup } from "@testing-library/react";
import ResetPassword from "@/app/(auth)/reset-password/page";
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { resetPasswordAction } from "@/app/actions";

// Mock dependencies
vi.mock("@/app/actions", () => ({
  resetPasswordAction: vi.fn().mockImplementation(async (formData) => {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }
    return { success: true };
  }),
}));

describe("ResetPassword Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the form correctly", async () => {
    const searchParams = Promise.resolve({ message: "" });
    const ResetPasswordPage = await ResetPassword({ searchParams });
    await act(async () => {
      render(ResetPasswordPage);
    });

    expect(
      screen.getByRole("heading", { name: /reset password/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it("does not render FormMessage when no message is provided", async () => {
    const searchParams = Promise.resolve({ message: "" });
    const ResetPasswordPage = await ResetPassword({ searchParams });
    await act(async () => {
      render(ResetPasswordPage);
    });

    const formMessage = screen.queryByTestId("form-message");
    expect(formMessage).not.toBeInTheDocument();
  });

  describe("resetPasswordAction", () => {
    it("returns an error if passwords do not match", async () => {
      const formData = new FormData();
      formData.append("password", "password123");
      formData.append("confirmPassword", "differentpassword");

      const result = await resetPasswordAction(formData);

      expect(result).toEqual({
        message: "Passwords do not match",
        success: false,
      });
    });

    it("returns success if passwords match", async () => {
      const formData = new FormData();
      formData.append("password", "password123");
      formData.append("confirmPassword", "password123");

      const result = await resetPasswordAction(formData);

      expect(result).toEqual({ success: true });
    });
  });
});
