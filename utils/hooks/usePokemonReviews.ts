"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserWithUsername } from "@/app/types/type-definitions";

const supabase = createClient();

export function usePokemonReviews(user: UserWithUsername) {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Pokémon data
  const fetchPokemon = async () => {
    if (!search) return;
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
      );
      if (!res.ok) {
        setPokemon(null);
        setNotFound(true);
        return;
      }

      const data = await res.json();
      console.log("POKEMON DATA: ", data);
      setPokemon({
        name: data.name,
        image: data.sprites.front_default,
        cries: data.cries,
        types: data.types,
        abilities: data.abilities,
      });
      fetchReviews(data.name);
      setNotFound(false);
    } catch (error) {
      console.error(error);
      setPokemon(null);
      setNotFound(true);
    }
  };

  // Fetch reviews
  const fetchReviews = async (pokemonName: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pokemon_reviews")
      .select("id, user_id, review, rating, created_at, profiles(username)")
      .eq("pokemon_name", pokemonName)
      .order(sortBy === "name" ? "pokemon_name" : "created_at", {
        ascending: true,
      });

    if (error) console.error("Error fetching reviews:", error);

    setReviews(data || []);
    setLoading(false);
  };

  // Create a new review
  const addReview = async () => {
    if (!pokemon || !newReview) return;
    const { error } = await supabase.from("pokemon_reviews").insert([
      {
        user_id: user.supabaseUser.id,
        pokemon_name: pokemon.name,
        review: newReview,
        rating,
      },
    ]);
    if (error) console.error(error);
    setNewReview("");
    fetchReviews(pokemon.name);
  };

  // Delete a review
  const deleteReview = async (id: string, userId: string) => {
    if (user.supabaseUser.id !== userId) {
      alert("You do not have permission to delete this review");
      return;
    }
    setReviews((prevReviews) => prevReviews.filter((r) => r.id !== id));
    const { error } = await supabase
      .from("pokemon_reviews")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting review:", error);
      fetchReviews(pokemon?.name);
    }
  };

  return {
    search,
    setSearch,
    pokemon,
    setPokemon,
    reviews,
    setReviews,
    newReview,
    setNewReview,
    rating,
    setRating,
    sortBy,
    setSortBy,
    notFound,
    loading,
    fetchPokemon,
    addReview,
    fetchReviews,
    deleteReview,
  };
}
