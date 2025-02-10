import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { convertToPHT } from "@/utils/convertToPht";

const supabase = createClient();

interface Review {
    id: string;
    pokemon_name: string;
    review: string;
    rating: number;
    created_at: string;
    profiles: { username: string };
}

const ReviewHistory: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [sortBy, setSortBy] = useState<"name" | "date">("date");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllReviews();
    }, [sortBy]);

    const fetchAllReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("pokemon_reviews")
            .select(`
                id, 
                pokemon_name, 
                review, 
                rating, 
                created_at, 
                profiles!inner(username) 
            `)
            .order(sortBy === "name" ? "pokemon_name" : "created_at", { ascending: sortBy === "name" });

        if (error) {
            console.error("Error fetching review history:", error);
            setLoading(false);
            return;
        }

        const formattedData = data?.map((review) => ({
            ...review,
            profiles: Array.isArray(review.profiles) ? review.profiles[0] : review.profiles,
        })) || [];

        setReviews(formattedData);
        setLoading(false);
    };

    return (
        <div className="p-3 bg-gray-100 border-4 border-black rounded-lg shadow-lg">
            <h2 className="text-md font-bold text-black text-center tracking-wide">
                Pokédex Review Log
            </h2>

            {/* Sorting Dropdown */}
            <select
                onChange={(e) => setSortBy(e.target.value as "name" | "date")}
                className="border-2 border-black p-1 w-full mt-2 rounded bg-green-950 text-white text-xs tracking-wide"
            >
                <option value="date">Sort by Latest Date</option>
                <option value="name">Sort by Pokémon Name</option>
            </select>

            {loading && <p className="text-center text-gray-500 text-xs mt-2">Loading reviews...</p>}

            {!loading && reviews.length === 0 && (
                <p className="text-center text-gray-500 text-xs mt-2">No reviews found.</p>
            )}

            {/* Scrollable Review List */}
            {!loading && reviews.length > 0 && (
                <div className="mt-3 max-h-[200px] overflow-y-auto pr-2 border-2 border-black p-2 bg-green-950 rounded-lg">
                    <ul className="space-y-1 ">
                        {reviews.map((review) => (
                            <li key={review.id} className="border p-2 rounded-md shadow bg-white text-[10px] leading-snug">
                                <p className="font-bold text-black text-xs">
                                    {review.pokemon_name.toUpperCase()}
                                </p>
                                <blockquote className="italic text-gray-800 border-l-2 border-gray-500 pl-2 mt-1 pb-2">
                                    "{review.review}"
                                </blockquote>
                                <p className="text-gray-600 text-[9px]">
                                    By <span className="font-bold">{review.profiles?.username}</span> | Rating: ⭐ {review.rating}
                                </p>
                                <p className="text-gray-500 text-[9px]">{convertToPHT(review.created_at)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ReviewHistory;
