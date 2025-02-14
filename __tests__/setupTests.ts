import { vi } from "vitest";

// Ensure Supabase mock applies to ALL tests
import "./__mocks__/supabase";

// Mock Next.js `cookies()` globally
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []), // No stored cookies
    set: vi.fn(),
    delete: vi.fn(),
  })),
  headers: vi.fn(() => new Headers()), // Mock headers function
}));
