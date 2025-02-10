import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface Review {
    id: string;
    pokemon_name: string;
    review: string;
    rating: number;
    created_at: string;
    profiles: { username: string }; //  profiles is a single object, not an array
}

const ReviewHistory: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [sortBy, setSortBy] = useState<"name" | "date">("date");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllReviews();
    }, [sortBy]);

    // Fetch all reviews, sorted by Pokémon name or review date
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
            .order(sortBy === "name" ? "pokemon_name" : "created_at", { ascending: true });

        if (error) {
            console.error("Error fetching review history:", error);
            setLoading(false);
            return;
        }
        console.log("Fetched reviews data", data);

        // Fix: Ensure `profiles` is treated as an object, NOT an array
        const formattedData = data?.map((review) => ({
            ...review,
            profiles: Array.isArray(review.profiles) ? review.profiles[0] : review.profiles, // Ensure `profiles` is an object
        })) || [];
        setReviews(formattedData);
        setLoading(false);


    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Review History</h2>

            {/* Sorting Dropdown */}
            <select
                onChange={(e) => setSortBy(e.target.value as "name" | "date")}
                className="border p-2 w-full mt-2"
            >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Pokémon Name</option>
            </select>

            {/* Show loading state */}
            {loading && <p className="text-center text-gray-500">Loading reviews...</p>}

            {/* No Reviews Message */}
            {!loading && reviews.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No reviews found.</p>
            )}

            {/* Reviews List */}
            {!loading && reviews.length > 0 && (
                <ul className="mt-4">
                    {reviews.map((review) => (
                        <li key={review.id} className="border p-2 mt-2">
                            <p className="text-sm font-bold">{review.profiles?.username || "Unknown User"}</p>
                            <p className="text-sm">{review.review}</p>
                            <p className="text-xs text-gray-500">
                                Pokémon: {review.pokemon_name} | Rating: {review.rating} ⭐
                            </p>
                            <p className="text-xs text-gray-400">Reviewed on: {new Date(review.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReviewHistory;
