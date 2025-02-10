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
            <h3 className="text-lg font-bold">Reviews</h3>

            {/* Review Form */}
            <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write a review..."
                className="border p-2 w-full mt-2"
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

            {/* Sorting Options */}
            <select onChange={(e) => setSortBy(e.target.value as "name" | "date")} className="border p-2 w-full mt-2">
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
            </select>

            {/* No Reviews Message */}
            {reviews.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">No reviews yet. Be the first to leave a review!</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id} className="border p-2 mt-2">
                            <p className="text-sm font-bold">{review.profiles?.username || "Unknown User"}</p>
                            <p className="text-sm">{review.review}</p>
                            <p className="text-xs text-gray-500">Rating: {review.rating} ⭐</p>

                            {review.user_id === userId && (
                                <button onClick={() => deleteReview(review.id, userId)} className="text-red-500 text-sm">
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
