"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaTrash, FaStar, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useState, useCallback, useMemo } from "react";
import FoodReview from "./FoodReview";
import { getImageSrc } from "@/utils/getImgSrc";

interface FoodListProps {
    userId: string;
    photos: {
        id: string;
        user_id: string;
        photo_url: string;
        photo_name: string;
        created_at: string;
    }[];
    deletePhoto: (id: string, photo_url: string) => void;
    updatePhotoName: (id: string, newName: string) => void;
}

export default function FoodList({ userId, photos, deletePhoto, updatePhotoName }: FoodListProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [newPhotoName, setNewPhotoName] = useState<string>("");


    // Memoizing the computed values
    const memoizedPhotos = useMemo(
        () =>
            photos.map((photo) => ({
                ...photo,
                isOwner: userId === photo.user_id, // Memoized ownership check
            })),
        [photos, userId]
    );

    // Function to handle name update (memoized)
    const handleUpdatePhotoName = useCallback(
        (id: string, name: string) => {
            updatePhotoName(id, name);
            setEditingPhotoId(null);
        },
        [updatePhotoName]
    );


    return (
        <div data-testid="food-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memoizedPhotos.map((photo) => (
                <Card key={photo.id} className={`relative ${photo.isOwner ? "bg-slate-800" : "bg-white dark:bg-black"}`}>
                    <CardContent className="flex flex-col items-center p-4">
                        <img
                            src={getImageSrc(photo.photo_url)}
                            alt={photo.photo_name}
                            className="w-full h-48 object-cover rounded-md"
                        />

                        {editingPhotoId === photo.id ? (
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newPhotoName}
                                    onChange={(e) => setNewPhotoName(e.target.value)}
                                    className="border p-1 rounded w-full"
                                />
                                <Button disabled={photo.photo_name === newPhotoName} onClick={() => handleUpdatePhotoName(photo.id, newPhotoName)}>
                                    <FaSave size={16} />
                                </Button>
                                <Button variant="secondary" onClick={() => setEditingPhotoId(null)}>
                                    <FaTimes size={16} />
                                </Button>
                            </div>
                        ) : (
                            <h3 className={`font-semibold mt-2 ${photo.isOwner ? "text-slate-300" : "dark:text-white"}`}>
                                {photo.photo_name}
                                {photo.isOwner && (
                                    <button
                                        className="bg-transparent pl-2 text-gray-500 hover:text-gray-700"
                                        onClick={() => {
                                            setEditingPhotoId(photo.id);
                                            setNewPhotoName(photo.photo_name);
                                        }}
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                )}
                            </h3>
                        )}

                        <p className="text-sm text-gray-500">Uploaded: {new Date(photo.created_at).toLocaleDateString()}</p>

                        <div className="flex gap-2 mt-3">
                            {photo.isOwner && (
                                <Button variant="destructive" onClick={() => deletePhoto(photo.id, photo.photo_url)}>
                                    <FaTrash className="mr-2" size={16} /> Delete
                                </Button>
                            )}
                            <Button onClick={() => setSelectedPhoto(photo.id)}>
                                <FaStar className="mr-2" size={16} /> Reviews
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {selectedPhoto && <FoodReview foodPhotoId={selectedPhoto} userId={userId} close={() => setSelectedPhoto(null)} />}
        </div>
    );
}
