"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useRef } from "react";
import { FaStar, FaTrash, FaTimes, FaEdit, FaSave } from "react-icons/fa";

interface Review {
    id: string;
    user_id: string;
    review: string;
    rating: number;
    created_at: string;
    username: string;
}

interface FoodReviewProps {
    foodPhotoId: string;
    userId: string;
    close: () => void;
}

export default function FoodReview({ foodPhotoId, userId, close }: FoodReviewProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editedReview, setEditedReview] = useState("");
    const [editedRating, setEditedRating] = useState(0);

    useEffect(() => {
        if (!foodPhotoId || hasFetched.current) return;
        hasFetched.current = true;

        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/food/reviews?foodPhotoId=${foodPhotoId}`);
                if (!response.ok) throw new Error("Failed to fetch reviews");
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [foodPhotoId]);

    const submitReview = async () => {
        if (!newReview.trim()) return alert("Review cannot be empty");

        setLoading(true);
        try {
            const response = await fetch("/api/food/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ foodPhotoId, review: newReview, rating, userId }),
            });

            if (!response.ok) throw new Error("Failed to submit review");
            const updatedResponse = await fetch(`/api/food/reviews?foodPhotoId=${foodPhotoId}`);
            const updatedData = await updatedResponse.json();
            setReviews(updatedData);
            setNewReview("");
            setRating(5);
        } catch (error) {
            console.error("Error adding review:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (id: string) => {
        try {
            const response = await fetch(`/api/food/reviews?id=${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete review");
            const updatedResponse = await fetch(`/api/food/reviews?foodPhotoId=${foodPhotoId}`);
            const updatedData = await updatedResponse.json();
            setReviews(updatedData);
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const updateReview = async (id: string) => {
        if (!editedReview.trim()) return;

        try {
            const response = await fetch("/api/food/reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, newReview: editedReview, newRating: editedRating, userId }),
            });

            if (!response.ok) throw new Error("Failed to update review");
            const updatedResponse = await fetch(`/api/food/reviews?foodPhotoId=${foodPhotoId}`);
            const updatedData = await updatedResponse.json();
            setReviews(updatedData);
            setEditingReviewId(null);
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-black rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <button onClick={close} className="absolute top-2 right-2 dark:text-red-800 dark:hover:text-red-500">
                    <FaTimes size={18} />
                </button>
                <h2 className="text-lg font-bold mb-4">Reviews</h2>

                {/* Add Review */}
                <div className="flex flex-col gap-2">
                    <Textarea
                        placeholder="Write your review..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                    <div className="flex justify-evenly gap-2 p-4">
                        <p className="text-gray-700 dark:text-white">How many Stars?</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <Button onClick={submitReview} disabled={loading} className="bg-blue-500 text-white">
                        {loading ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>

                {/* List of Reviews */}
                <div className="mt-4 max-h-60 overflow-y-auto">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b py-2 flex justify-between items-center">
                            <div className="w-full">
                                {editingReviewId === review.id ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={editedReview}
                                            onChange={(e) => setEditedReview(e.target.value)}
                                            className="border p-1 rounded w-full dark:bg-gray-700 dark:text-white"
                                        />
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
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-800 dark:text-white">{review.review}</p>
                                        <div className="flex gap-1 text-yellow-500 pb-2">
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <FaStar key={`${review.id}-star-${i}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            Review by <span className="font-semibold">{review.username}</span>
                                        </span>
                                    </>
                                )}
                            </div>
                            {userId === review.user_id && (
                                <div className="flex gap-2">
                                    {editingReviewId === review.id ? (
                                        <>
                                            <button onClick={() => updateReview(review.id)} className="pl-2 text-green-500 hover:text-green-800">
                                                <FaSave size={16} />
                                            </button>
                                            <button onClick={() => setEditingReviewId(null)} className="text-gray-500 hover:text-gray-700">
                                                <FaTimes size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingReviewId(review.id);
                                                setEditedReview(review.review);
                                                setEditedRating(review.rating);
                                            }}
                                            className="text-blue-500 hover:text-blue-800"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                    )}
                                    <button onClick={() => deleteReview(review.id)} className="text-red-500 hover:text-red-900 pr-2">
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
