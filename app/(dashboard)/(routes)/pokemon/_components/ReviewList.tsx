
import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";
import { FaEdit, FaSave, FaStar, FaTimes } from "react-icons/fa";
import { Pokemon } from "./PokemonDisplay";

interface ReviewListProps {
    reviews: any[];
    setReviews: React.Dispatch<React.SetStateAction<any[]>>;
    userId: string;
    deleteReview: (id: string, userId: string) => void;
    loading: boolean;
    newReview: string;
    setNewReview: (value: string) => void;
    rating: number;
    setRating: (value: number) => void;
    addReview: () => void;
    sortBy: "name" | "date";
    setSortBy: (value: "name" | "date") => void;
    pokemon: Pokemon;
}

interface PokemonReviews {
    id: string;
    user_id: string;
    pokemon_name: string;
    review: string;
    rating: number;
    created_at: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
    reviews,
    setReviews,
    userId,
    deleteReview,
    loading,
    newReview,
    setNewReview,
    rating,
    setRating,
    addReview,
    pokemon,
    sortBy,
    setSortBy
}) => {
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editedReview, setEditedReview] = useState<string>("");
    const [editedRating, setEditedRating] = useState<number>(0);
    const [saving, setSaving] = useState(false);

    if (loading) return <p className="text-sm mx-auto pt-12">Loading reviews...</p>;

    const updateReview = async (id: string) => {
        setSaving(true);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("pokemon_reviews")
                .update({ review: editedReview, rating: editedRating })
                .eq("id", id);

            if (error) {
                console.error("Error updating review:", error);
                return;
            }

            const { data: updatedReviews } = await supabase
                .from("pokemon_reviews")
                .select("id, user_id, review, rating, created_at, profiles(username)")
                .eq("pokemon_name", pokemon.name)
                .order("created_at", { ascending: false });

            if (updatedReviews) {
                setReviews(updatedReviews);
            } else {
                console.error("No updated reviews found");
            }
            setEditingReviewId(null);
        } catch (error) {
            console.error("Error updating review:", error);
        } finally {
            setSaving(false);
        }
    };




    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold dark:text-black">Reviews</h3>

            {/* Review Form */}
            <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write a review..."
                className="border p-2 w-full mt-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 bg-green-950 text-white"
            />
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 w-full mt-2 rounded-md text-white bg-green-950">
                {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                        {num} Stars
                    </option>
                ))}
            </select>
            <button
                onClick={addReview}
                disabled={newReview.trim() === "" || rating === 0}
                className={`px-4 py-2 mt-2 w-full rounded-md transition ${newReview.trim() === "" || rating === 0
                    ? "bg-gray-400 cursor-not-allowed"  // Disabled state
                    : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
            >
                Submit Review
            </button>


            {/* No Reviews Message */}
            {reviews.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">No reviews yet. Be the first to leave a review!</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id} className="border p-4 mt-4 rounded-lg shadow-md bg-green-950 dark:bg-green-950">
                            <p className="text-sm font-bold text-blue-600 dark:text-white">{review.profiles?.username || "Unknown User"}</p>
                            {editingReviewId === review.id ? (
                                <>
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={editedReview}
                                            onChange={(e) => setEditedReview(e.target.value)}
                                            placeholder="Write a review..."
                                            className="border p-2 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 bg-green-950 text-white"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-gray-700 dark:text-white">Update Stars:</p>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`cursor-pointer ${star <= editedRating ? "text-yellow-500" : "text-gray-300"}`}
                                                onClick={() => setEditedRating(star)}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <blockquote className="italic text-slate-300 dark:text-white border-l-4 border-green-300 pl-3 mt-1">
                                        "{review.review}"
                                    </blockquote>
                                    <p className="text-xs text-gray-500 mt-2">⭐ {review.rating} Stars</p>
                                </>
                            )}
                            {userId === review.user_id && (
                                <div className="flex gap-2">
                                    {editingReviewId === review.id ? (
                                        <>
                                            <button>
                                                <FaSave onClick={() => updateReview(review.id)} className="w-6 h-6 text-green-500 hover:text-green-600 cursor-pointer" />
                                            </button>
                                            <button>
                                                <FaTimes onClick={() => setEditingReviewId(null)} className="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer" />
                                            </button>
                                        </>
                                    ) : (
                                        <button>
                                            <FaEdit onClick={() => setEditingReviewId(review.id)} className="w-6 h-6 text-blue-500 hover:text-blue-600 cursor-pointer" />
                                        </button>
                                    )}
                                </div>
                            )}
                            {review.user_id === userId && (
                                <button onClick={() => deleteReview(review.id, userId)} className="text-red-500 text-sm mt-2 hover:text-red-700">
                                    Delete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReviewList;
