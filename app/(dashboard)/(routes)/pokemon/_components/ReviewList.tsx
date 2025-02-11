import React from "react";

interface ReviewListProps {
    reviews: any[];
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
}

const ReviewList: React.FC<ReviewListProps> = ({
    reviews,
    userId,
    deleteReview,
    loading,
    newReview,
    setNewReview,
    rating,
    setRating,
    addReview,
    sortBy,
    setSortBy
}) => {
    if (loading) return <p className="text-sm mx-auto pt-12">Loading reviews...</p>;

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
            <button onClick={addReview} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-2 w-full rounded-md transition">
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

                            <blockquote className="italic text-slate-300 dark:text-white border-l-4 border-green-300 pl-3 mt-1">
                                "{review.review}"
                            </blockquote>

                            <p className="text-xs text-gray-500 mt-2">⭐ {review.rating} Stars</p>

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
