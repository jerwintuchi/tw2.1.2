import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST, DELETE, PATCH } from "@/app/api/photos/route";
import { createClient } from "@/utils/supabase/server";

const mockPhotos = [
  {
    id: "photo-123",
    user_id: "user-123",
    photo_name: "Vacation Photo",
    photo_url: "drive/photo123.jpg",
    created_at: "2023-01-01T00:00:00Z",
  },
];

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: mockPhotos, error: null }),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: mockPhotos[0],
            error: null,
          }),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { id: "photo-123", photo_name: "Updated Name" },
              error: null,
            }),
          })),
        })),
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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("API: /api/photos", () => {
  it("should fetch user photos (GET)", async () => {
    const req = new Request("http://localhost/api/photos?userId=user-123");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveLength(1);
    expect(json[0]).toMatchObject({ photo_name: "Vacation Photo" });
  });

  it("should upload a new photo (POST)", async () => {
    const formData = new FormData();
    formData.append("userId", "user-123");
    formData.append(
      "files",
      new File(["content"], "photo.jpg", { type: "image/jpeg" })
    );

    const req = new Request("http://localhost/api/photos", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveLength(1); //  Ensure response is an array
    expect(json[0]).toMatchObject(mockPhotos[0]); //  Access first element, so that it don't return an array but an object
  });

  it("should delete a photo (DELETE)", async () => {
    const req = new Request(
      "http://localhost/api/photos?id=photo-123&photo_url=drive/photo123.jpg",
      {
        method: "DELETE",
      }
    );

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Photo deleted successfully");
  });

  it("should update a photo name (PATCH)", async () => {
    const req = new Request("http://localhost/api/photos", {
      method: "PATCH",
      body: JSON.stringify({
        id: "photo-123",
        newName: "Updated Name",
      }),
    });

    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.photo_name).toBe("Updated Name");
  });
});
