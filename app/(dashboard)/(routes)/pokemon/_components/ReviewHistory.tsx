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

    // Fetch all reviews, sorted by Pokémon name or latest review date
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

        console.log("Fetched reviews data", data);

        const formattedData = data?.map((review) => ({
            ...review,
            profiles: Array.isArray(review.profiles) ? review.profiles[0] : review.profiles,
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
                <option value="date">Sort by Latest Date</option>
                <option value="name">Sort by Pokémon Name</option>
            </select>

            {/* Show loading state */}
            {loading && <p className="text-center text-gray-500">Loading reviews...</p>}

            {/* No Reviews Message */}
            {!loading && reviews.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No reviews found.</p>
            )}

            {/* Scrollable Reviews List */}
            {!loading && reviews.length > 0 && (
                <div className="mt-4 max-h-[400px] overflow-y-auto pr-2">
                    <ul>
                        {reviews.map((review) => (
                            <li key={review.id} className="border p-2 mt-2">
                                <p className="text-sm font-bold pb-2">{review.pokemon_name.toUpperCase()}</p>
                                <blockquote className="italic"><p className="text-sm pb-2">"{review.review}"</p></blockquote>
                                <p className="text-xs text-gray-500">
                                    By {review.profiles?.username} | Rating: {review.rating} ⭐
                                </p>
                                <p className="text-xs text-gray-400">
                                    Reviewed on: {convertToPHT(review.created_at)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ReviewHistory;
