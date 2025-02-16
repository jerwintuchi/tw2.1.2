import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST, DELETE, PATCH } from "@/app/api/food/reviews/route";
import { createClient } from "@/utils/supabase/server";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({
          data: [{ id: "1", review: "New review" }],
          error: null,
        }),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }), // ✅ Fix here
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn().mockResolvedValue({
            data: [{ id: "r-123", review: "Updated review!", rating: 4 }],
            error: null,
          }),
        })),
      })),
    })),
  })),
}));

const mockReviews = [
  {
    id: "r-123",
    user_id: "user-123",
    review: "Delicious food!",
    rating: 5,
    food_photo_id: "photo-123",
    created_at: "2023-01-01T00:00:00Z",
    profiles: { username: "Foodie123" },
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("API: /api/food/reviews", () => {
  describe("API: /api/food/reviews", () => {
    it("should fetch food reviews (GET)", async () => {
      const req = new Request(
        "http://localhost/api/food/reviews?foodPhotoId=photo-123"
      );
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toHaveLength(1);
      expect(json[0]).toMatchObject({ review: "Delicious food!", rating: 5 });
    });

    it("should add a new review (POST)", async () => {
      const req = new Request("http://localhost/api/food/reviews", {
        method: "POST",
        body: JSON.stringify({
          foodPhotoId: "photo-456",
          review: "New review",
          rating: 4,
          userId: "user-789",
        }),
      });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json).toEqual({ message: "Review added" });
    });

    it("should delete a review (DELETE)", async () => {
      const req = new Request("http://localhost/api/food/reviews?id=r-123", {
        method: "DELETE",
      });
      const res = await DELETE(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toBe("Review deleted");
    });
  });

  it("should update a review (PATCH)", async () => {
    const req = new Request("http://localhost/api/food/reviews", {
      method: "PATCH",
      body: JSON.stringify({
        id: "r-123",
        newReview: "Updated review!",
        newRating: 4,
      }),
    });

    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual([
      { id: "r-123", review: "Updated review!", rating: 4 },
    ]);
  });
});
