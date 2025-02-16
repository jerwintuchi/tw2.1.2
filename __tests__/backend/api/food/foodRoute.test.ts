import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST, DELETE, PATCH } from "@/app/api/food/route";

const mockFoodPhotos = [
  {
    id: "1",
    user_id: "user123",
    photo_url: "https://example.com/photo1.jpg",
    photo_name: "Food Photo",
    created_at: "2023-01-01T00:00:00Z",
  },
];

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({ data: mockFoodPhotos, error: null }), 
      })),
      insert: vi.fn(() => ({
        select: vi
          .fn()
          .mockResolvedValue({ data: [mockFoodPhotos[0]], error: null }), 
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi
            .fn()
            .mockResolvedValue({ data: [mockFoodPhotos[0]], error: null }), 
        })),
      })),
      delete: vi.fn(() => ({
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        remove: vi.fn().mockResolvedValue({ error: null }),
      })),
    },
  })),
}));

const mockPhotos = [
  {
    id: "1",
    user_id: "user123",
    photo_url: "https://example.com/photo1.jpg",
    photo_name: "Food Photo",
    created_at: "2023-01-01T00:00:00Z",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("API: /api/food", () => {
  it("should fetch food photos (GET)", async () => {
    const req = new Request("http://localhost/api/food?sortType=date");
    const res = await GET(req);
    const data = await res.json();

    expect(data).toEqual(mockPhotos);
    expect(res.status).toBe(200);
  });

  it("should upload food photos (POST)", async () => {
    const formData = new FormData();
    formData.append("userId", "user123");
    formData.append(
      "files",
      new File([""], "food.jpg", { type: "image/jpeg" })
    );

    const req = new Request("http://localhost/api/food", {
      method: "POST",
      body: formData,
    });
    const res = await POST(req);
    const data = await res.json();

    expect(data).toEqual([mockPhotos[0]]);
    expect(res.status).toBe(200);
  });

  it("should delete food photos (DELETE)", async () => {
    const req = new Request(
      "http://localhost/api/food?id=1&photo_url=photo1.jpg",
      { method: "DELETE" }
    );
    const res = await DELETE(req);
    const data = await res.json();

    expect(data).toEqual({ message: "Photos deleted successfully" });
    expect(res.status).toBe(200);
  });

  it("should update photo name (PATCH)", async () => {
    const req = new Request("http://localhost/api/food", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", newName: "New Food Name" }),
    });
    const res = await PATCH(req);
    const data = await res.json();

    expect(data).toEqual([mockPhotos[0]]);
    expect(res.status).toBe(200);
  });
});
