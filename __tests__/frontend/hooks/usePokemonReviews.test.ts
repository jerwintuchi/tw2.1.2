// tests/usePokemonReviews.test.tsx
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { usePokemonReviews } from "@/utils/hooks/usePokemonReviews";
import type { UserWithUsername } from "@/app/types/type-definitions";

// Mock User
const mockUser: UserWithUsername = {
  supabaseUser: {
    id: "user-123",
    aud: "authenticated",
    role: "authenticated",
    email: "test@example.com",
    app_metadata: {},
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  username: "AshKetchum",
};

// Define mockReviews in the global scope
let mockReviews = [
  {
    id: "r-123",
    user_id: "user-123",
    review: "Great Pokémon!",
    rating: 5,
    pokemon_name: "pikachu",
    created_at: new Date().toISOString(),
    profiles: { username: "AshKetchum" }
  },
];

// Set up Supabase mock before tests run
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn().mockImplementation(() => Promise.resolve({ data: mockReviews, error: null })),
        })),
      })),
      insert: vi.fn(async (newReview) => {
        const reviewData = { 
          ...newReview[0], 
          id: `r-${Math.random()}`,
          created_at: new Date().toISOString(),
          profiles: { username: mockUser.username }
        };
        mockReviews.push(reviewData);
        return { error: null };
      }),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
  })),
}));

// Mock PokeAPI Response
global.fetch = vi.fn((url) =>
  Promise.resolve({
    ok: url.includes("pikachu"),
    json: () =>
      url.includes("pikachu")
        ? Promise.resolve({
            name: "pikachu",
            sprites: { front_default: "pikachu.png" },
            cries: {},
            types: [{ type: { name: "electric" } }],
            abilities: [{ ability: { name: "static" } }],
          })
        : Promise.reject(),
  })
) as any;

describe("usePokemonReviews Hook", () => {
  beforeEach(() => {
    // Reset mockReviews before each test
    mockReviews = [
      {
        id: "r-123",
        user_id: "user-123",
        review: "Great Pokémon!",
        rating: 5,
        pokemon_name: "pikachu",
        created_at: new Date().toISOString(),
        profiles: { username: "AshKetchum" }
      },
    ];
    
    vi.clearAllMocks();
  });

  it("should fetch Pokémon data successfully", async () => {
    const { result } = renderHook(() => usePokemonReviews(mockUser));

    act(() => {
      result.current.setSearch("pikachu");
    });

    await act(async () => {
      await result.current.fetchPokemon();
    });

    expect(result.current.pokemon).toMatchObject({
      name: "pikachu",
      image: "pikachu.png",
    });
  });

  it("should handle Pokémon not found", async () => {
    const { result } = renderHook(() => usePokemonReviews(mockUser));

    act(() => {
      result.current.setSearch("MissingNo");
    });

    await act(async () => {
      await result.current.fetchPokemon();
    });

    expect(result.current.pokemon).toBe(null);
    expect(result.current.notFound).toBe(true);
  });

  it("should fetch and sort reviews correctly", async () => {
    const { result } = renderHook(() => usePokemonReviews(mockUser));

    // Set pokemon first so reviews can be fetched
    act(() => {
      result.current.setPokemon({
        name: "pikachu",
        image: "pikachu.png",
      });
    });

    await act(async () => {
      await result.current.fetchReviews("pikachu");
    });

    await waitFor(() => {
      expect(result.current.reviews).toHaveLength(1);
      expect(result.current.reviews[0]).toMatchObject({
        review: "Great Pokémon!",
        rating: 5,
      });
    });
  });

  it("should add a new review", async () => {
    const { result } = renderHook(() => usePokemonReviews(mockUser));
    
    // Set pokemon first
    act(() => {
      result.current.setPokemon({
        name: "pikachu",
        image: "pikachu.png",
      });
      
      // Set initial reviews
      result.current.setReviews([...mockReviews]);
    });
    
    // Verify initial state
    expect(result.current.reviews).toHaveLength(1);
  
    // Set new review content
    act(() => {
      result.current.setNewReview("Amazing!");
    });
  
    // Add the new review
    await act(async () => {
      await result.current.addReview();
    });
  
    // Check if fetchReviews was called and updated the reviews state
    await waitFor(() => {
      expect(mockReviews).toHaveLength(2);
      expect(mockReviews[1]).toMatchObject({
        review: "Amazing!",
        rating: 5,
        pokemon_name: "pikachu",
      });
    });
  });

  it("should prevent adding empty reviews", async () => {
    const { result } = renderHook(() => usePokemonReviews(mockUser));

    // Set pokemon but empty review
    act(() => {
      result.current.setPokemon({
        name: "pikachu",
        image: "pikachu.png",
      });
      result.current.setNewReview("");
    });

    // Try to add empty review
    await act(async () => {
      await result.current.addReview();
    });

    // Should not add new review
    expect(mockReviews).toHaveLength(1);
  });

  it("should delete a user's own review", async () => {
    const { result } = renderHook(() => usePokemonReviews(mockUser));

    // Add a review first
    act(() => {
      result.current.setPokemon({
        name: "pikachu",
        image: "pikachu.png",
      });
      
      result.current.setReviews([
        {
          id: "r-456",
          user_id: "user-123",
          review: "Amazing!",
          rating: 5,
        },
      ]);
    });

    expect(result.current.reviews).toHaveLength(1);

    // Delete the review
    await act(async () => {
      await result.current.deleteReview("r-456", "user-123");
    });

    // Reviews should be empty after deletion
    expect(result.current.reviews).toHaveLength(0);
  });

  it("should prevent deleting someone else's review", async () => {
    const { result } = renderHook(() => usePokemonReviews(mockUser));
    
    // Create an alert mock
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
  
    act(() => {
      result.current.setPokemon({
        name: "pikachu",
        image: "pikachu.png",
      });
      
      // Set reviews with someone else's review
      result.current.setReviews([
        {
          id: "r-789",
          user_id: "user-999", // Different user
          review: "I love this Pokémon!",
          rating: 4,
        },
      ]);
    });
  
    expect(result.current.reviews).toHaveLength(1);
    
    // Try to delete someone else's review
    await act(async () => {
      await result.current.deleteReview("r-789", "user-999");
    });
  
    // The review should still be there
    expect(result.current.reviews).toHaveLength(1);
    expect(alertMock).toHaveBeenCalled();
    
    alertMock.mockRestore();
  });
});