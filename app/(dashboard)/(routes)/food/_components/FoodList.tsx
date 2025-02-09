"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaTrash, FaStar } from "react-icons/fa";
import { useState } from "react";
import FoodReview from "./FoodReview";
import { getImageSrc } from "@/utils/getImgSrc";


interface FoodListProps {
    userId: string;
    photos: {
        id: string;
        photo_url: string;
        photo_name: string;
        created_at: string;
    }[];
    deletePhoto: (id: string, photo_url: string) => void;
}

export default function FoodList({ userId, photos, deletePhoto }: FoodListProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
                <Card key={photo.id} className="relative">
                    <CardContent className="flex flex-col items-center p-4">
                        <img
                            src={getImageSrc(photo.photo_url)}
                            alt={photo.photo_name}
                            className="w-full h-48 object-cover rounded-md"
                        />
                        <h3 className="font-semibold mt-2">{photo.photo_name}</h3>
                        <p className="text-sm text-gray-500">
                            Uploaded: {new Date(photo.created_at).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2 mt-3">
                            <Button
                                variant="destructive"
                                onClick={() => deletePhoto(photo.id, photo.photo_url)}
                            >
                                <FaTrash size={16} /> Delete
                            </Button>
                            <Button onClick={() => setSelectedPhoto(photo.id)}>
                                <FaStar size={16} /> Reviews
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Review Modal */}
            {selectedPhoto && (
                <FoodReview foodPhotoId={selectedPhoto} userId={userId} close={() => setSelectedPhoto(null)} />
            )}
        </div>
    );
}
