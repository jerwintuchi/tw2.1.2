"use client";

import React from "react";
import { UserWithUsername } from "@/app/types/type-definitions";
import Image from "next/image";
import { usePokemonReviews } from "@/utils/hooks/usePokemonReviews";
import PokemonDisplay from "./PokemonDisplay";
import ReviewList from "./ReviewList";
import SearchBar from "./SearchBar";
import ReviewHistory from "./ReviewHistory";

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
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-8 max-w-5xl mx-auto bg-red-600 min-h-screen border-8 border-black rounded-lg shadow-lg relative">

            {/*  Pokédex Side Panel */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-500 border-2 border-black rounded-full animate-pulse"></div>
                    <div className="w-5 h-5 bg-yellow-400 border-2 border-black rounded-full"></div>
                    <div className="w-5 h-5 bg-green-500 border-2 border-black rounded-full"></div>
                </div>
            </div>

            {/*  Left Section: Pokédex Screen */}
            <div className="flex-1 max-w-lg w-full bg-gray-100 rounded-lg p-6 border-4 border-black shadow-lg relative mt-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-black">Pokédex</h2>

                <SearchBar search={search} setSearch={setSearch} fetchPokemon={fetchPokemon} />

                {/* 🖥 Pokédex Screen (Smaller & Centered) */}
                <div className="bg-gray-200 border-4 border-black p-6 rounded-lg mt-4 shadow-inner relative">
                    {!pokemon && !notFound && (
                        <div className="text-center text-gray-600">
                            <Image className="mx-auto pb-4" src={`/static/pikachu_glass.png`} width={100} height={100} alt="Pikachu Magnifying Glass" unoptimized />
                            <h2 className="text-xl font-bold">Search for a Pokémon</h2>
                            <p className="text-sm text-gray-500">Enter a Pokémon name to find reviews.</p>
                        </div>
                    )}
                    <PokemonDisplay pokemon={pokemon} />
                </div>

                {/* 📜 Review Section Styled as Pokédex Log */}
                {pokemon && (
                    <div className="mt-4 bg-gray-100 border-2 border-black p-4 rounded-lg">
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
                            setSortBy={setSortBy}
                        />
                    </div>
                )}

                {/* Pokémon Not Found Section */}
                {!pokemon && notFound && (
                    <div className="mt-4 text-center pt-12">
                        <Image className="mx-auto pb-4" src={`/static/pikachu_glass.png`} width={100} height={100} alt="Pikachu Magnifying Glass" unoptimized />
                        <h2 className="text-xl font-bold text-black">No Pokémon found.</h2>
                    </div>
                )}
            </div>

            {/* 📖 Right Section (Pokédex Review History) */}
            <div className="md:w-1/3 w-full bg-gray-100 border-4 border-black p-4 rounded-lg shadow-lg mt-8 md:mt-0">
                <ReviewHistory />
            </div>
        </div>
    );
}
