import { render, screen } from "@testing-library/react";
import { FormMessage } from "@/components/form-message";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";

describe("FormMessage Component", () => {
  it("renders success message correctly", async () => {
    // Correctly define the message type
    const message = { success: "Success! Your account has been created." };
    const FormMessageComponent = FormMessage({ message });
    render(FormMessageComponent); // Correct usage of render

    const successMessage = screen.getByText(message.success);
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveClass("text-foreground");
    expect(successMessage).toHaveClass("border-foreground");
  });

  it("renders error message correctly", async () => {
    const message = { error: "Error! Something went wrong." };
    const FormMessageComponent = FormMessage({ message });

    render(FormMessageComponent);

    const errorMessage = screen.getByText(message.error);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-destructive-foreground");
    expect(errorMessage).toHaveClass("border-destructive-foreground");
  });

  it("renders generic message correctly", async () => {
    const message = { message: "This is a generic message." };
    const FormMessageComponent = FormMessage({ message });

    render(FormMessageComponent);

    const genericMessage = screen.getByText(message.message);
    expect(genericMessage).toBeInTheDocument();
    expect(genericMessage).toHaveClass("text-foreground");
    expect(genericMessage).not.toHaveClass("border-foreground");
  });
});
