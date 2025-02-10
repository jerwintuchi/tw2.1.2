'use client'

import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { UserWithUsername } from '@/app/types/type-definitions';

const supabase = createClient()

interface PokemonClientProps {
    user: UserWithUsername;
}

export default function PokemonPage({ user }: PokemonClientProps) {
    const [search, setSearch] = useState('')
    const [pokemon, setPokemon] = useState<any>(null)
    const [reviews, setReviews] = useState<any[]>([])
    const [newReview, setNewReview] = useState('')
    const [rating, setRating] = useState(5)
    const [sortBy, setSortBy] = useState<'name' | 'date'>('date')
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch Pokémon data
    const fetchPokemon = async () => {
        if (!search) return;
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);

            if (!res.ok) {
                setPokemon(null);
                setNotFound(true);  // Pokémon was not found
                return;
            }

            const data = await res.json();
            setPokemon({
                name: data.name,
                image: data.sprites.front_default,
            });
            fetchReviews(data.name);
            setNotFound(false);  // Reset error state
        } catch (error) {
            console.error(error);
            setPokemon(null);
            setNotFound(true);  // Handle error as "not found"
        }
    };


    // Fetch reviews from Supabase


    const fetchReviews = async (pokemonName: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('pokemon_reviews')
            .select('id, user_id, review, rating, created_at, profiles(username)')
            .eq('pokemon_name', pokemonName)
            .order(sortBy === 'name' ? 'pokemon_name' : 'created_at', { ascending: true });

        if (error) console.error("Error fetching reviews:", error);
        setReviews(data || []);
        setLoading(false);
    };



    // Create a new review
    const addReview = async () => {
        if (!pokemon || !newReview) return
        const { error } = await supabase.from('pokemon_reviews').insert([
            { user_id: user.supabaseUser.id, pokemon_name: pokemon.name, review: newReview, rating },
        ])
        if (error) console.error(error)
        setNewReview('')
        fetchReviews(pokemon.name) // Refresh list
    }

    // Delete a review
    const deleteReview = async (id: string, userId: string) => {
        if (user.supabaseUser.id !== userId) {
            alert('You do not have permission to delete this review');
            return;
        }

        // Remove the review from state instantly
        setReviews((prevReviews) => prevReviews.filter((r) => r.id !== id));

        const { error } = await supabase.from('pokemon_reviews').delete().eq('id', id);
        if (error) {
            console.error("Error deleting review:", error);
            fetchReviews(pokemon?.name); // Re-fetch if deletion fails
        }
    };


    return (
        <div className="p-4 max-w-md mx-auto">
            {/* Search Input */}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Pokémon..."
                className="border p-2 w-full"
            />
            <button onClick={fetchPokemon} className="bg-blue-500 text-white px-4 py-2 mt-2">
                Search
            </button>

            {/* Pokémon Display */}
            {pokemon && (
                <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{pokemon.name}</h2>
                    <img src={pokemon.image} alt={pokemon.name} className="mx-auto" />
                </div>

            )}

            {/* Review Section */}
            {pokemon && (
                <div className="mt-4">
                    <h3 className="text-lg font-bold">Reviews</h3>
                    {/* Review Form */}
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Write a review..."
                        className="border p-2 w-full"
                    />
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 w-full mt-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num} Stars
                            </option>
                        ))}
                    </select>
                    <button onClick={addReview} className="bg-green-500 text-white px-4 py-2 mt-2 w-full">
                        Submit Review
                    </button>

                    {/* Sorting */}
                    <select onChange={(e) => setSortBy(e.target.value as 'name' | 'date')} className="border p-2 w-full mt-2">
                        <option value="date">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                    </select>

                    {/* Reviews List */}
                    {loading ? (<p>Loading reviews...</p>) : (<ul className="mt-4">
                        {reviews.map((review) => (
                            <li key={review.id} className="border p-2 mt-2">
                                <p className="text-sm font-bold">{review.profiles?.username || "Unknown User"}</p>
                                <p className="text-sm">{review.review}</p>
                                <p className="text-xs text-gray-500">Rating: {review.rating} ⭐</p>

                                {review.user_id === user.supabaseUser.id && (
                                    <button onClick={() => deleteReview(review.id, user.supabaseUser.id)} className="text-red-500 text-sm">
                                        Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>)}

                </div>
            )}
            {!pokemon && notFound && (
                (
                    <div className="mt-4 text-center pt-12">
                        <Image className='mx-auto pb-4' src={`/static/pikachu_glass.png`} width={100} height={100} alt="Pikachu Magnifying Glass" unoptimized />

                        <h2 className="text-xl font-bold text-slate-600">No Pokémon found.</h2>
                    </div>
                )
            )}
        </div>
    )
}
