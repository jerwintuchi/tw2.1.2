"use client";

import React from "react";
import { UserWithUsername } from "@/app/types/type-definitions";

import Image from "next/image";
import { usePokemonReviews } from "@/utils/hooks/usePokemonReviews";
import PokemonDisplay from "./PokemonDisplay";
import ReviewList from "./ReviewList";
import SearchBar from "./SearchBar";

interface PokemonClientProps {
    user: UserWithUsername;
}

export default function PokemonPage({ user }: PokemonClientProps) {
    const {
        search,
        setSearch,
        pokemon,
        reviews,
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
        deleteReview,
    } = usePokemonReviews(user);

    return (
        <div className="p-4 max-w-md mx-auto">
            <SearchBar search={search} setSearch={setSearch} fetchPokemon={fetchPokemon} />

            <PokemonDisplay pokemon={pokemon} />

            {pokemon && (
                <div className="mt-4">
                    <ReviewList
                        reviews={reviews}
                        userId={user.supabaseUser.id}
                        deleteReview={deleteReview}
                        loading={loading}
                        newReview={newReview}
                        setNewReview={setNewReview}
                        rating={rating}
                        setRating={setRating}
                        addReview={addReview}
                        sortBy={sortBy}
                        setSortBy={setSortBy} />
                </div>
            )}

            {!pokemon && notFound && (
                <div className="mt-4 text-center pt-12">
                    <Image className="mx-auto pb-4" src={`/static/pikachu_glass.png`} width={100} height={100} alt="Pikachu Magnifying Glass" unoptimized />
                    <h2 className="text-xl font-bold text-slate-600">No Pokémon found.</h2>
                </div>
            )}
        </div>
    );
}
