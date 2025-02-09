"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


import { useEffect, useState } from "react";
import { FaStar, FaTrash, FaTimes } from "react-icons/fa";

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
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!foodPhotoId) return;
            try {
                const response = await fetch(`/api/food/reviews?foodPhotoId=${foodPhotoId}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    console.error("Error fetching reviews:", response.statusText);
                    return;
                }

                const data = await response.json();
                console.log("Fetched Reviews from frontend:", data); // Debugging logs

                // Ensure each review has a username
                const updatedReviews = data.map((review: Review) => ({
                    ...review,
                    username: review.username ?? "Unknown", // Ensure username is properly extracted
                }));


                setReviews(updatedReviews);
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
            // Fetch the username of the current user
            const userResponse = await fetch(`/api/user?userId=${userId}`);
            const userData = await userResponse.json();
            const username = userData?.username || "Unknown";

            // Submit the new review
            const response = await fetch("/api/food/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    foodPhotoId,
                    review: newReview,
                    rating,
                    userId,
                }),
            });

            if (!response.ok) throw new Error("Failed to submit review");

            const addedReview = await response.json();

            // Immediately update UI with username
            setReviews((prev) => [
                { ...addedReview, username }, // Inject username
                ...prev,
            ]);

            setNewReview("");
            setRating(5);
        } catch (error) {
            console.error("Error adding review:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (id: string) => {
        console.log("id", id);
        try {
            await fetch(`/api/food/reviews?id=${id}`, { method: "DELETE" });
            setReviews((prev) => prev.filter((review) => review.id !== id));
        } catch (error) {
            console.error("Error deleting review:", error);
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
                    />
                    <div className="flex justify-evenly gap-2 p-4">
                        <p className="flex dark:text-white">How many Stars?</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`flex cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <Button onClick={submitReview} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>

                {/* List of Reviews */}
                <div className="mt-4 max-h-60 overflow-y-auto">
                    <span className="text-gray-500">Reviews:</span>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b py-2 flex justify-between items-center">
                                <div>
                                    <p className="text-sm dark:text-white">{review.review}</p>
                                    <div className="flex gap-1 text-yellow-500 pb-2">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                    <span className="flex flex-row text-xs text-gray-500">
                                        <p className="flex pr-1">Review by {review.username} on </p>
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {/* Only render the delete button for the user who created the review */}
                                {userId === review.user_id && <button onClick={() => deleteReview(review.id)} className="text-red-500 hover:text-red-900 pr-2">
                                    <FaTrash />
                                </button>}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
