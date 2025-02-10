"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import { FaSortAlphaDown, FaSortNumericDown } from "react-icons/fa"

import { usePhoto } from "../../../../../utils/hooks/usePhoto";
import { PhotoUploader } from "../../drive/_components/PhotoUploader";
import FoodList from "./FoodList";
import { User } from "@supabase/supabase-js";


export default function FoodReviewManager({ user }: { user: User }) {
    const {
        photos,
        uploading,
        search,
        setSearch,
        sortType,
        setSortType,
        uploadPhotos,
        deletePhoto,
        updatePhotoName
    } = usePhoto(user.id, "food");

    return (
        <div className="flex flex-col gap-4 max-w-full mx-auto p-4">
            <h2 className="text-xl font-bold text-center">Manage your Food Reviews</h2>

            <PhotoUploader uploading={uploading} uploadPhotos={uploadPhotos} />

            <Input
                type="text"
                placeholder="Search by food name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-2">
                <Button onClick={() => setSortType("name")}>
                    <FaSortAlphaDown size={18} /> Sort by Name
                </Button>
                <Button onClick={() => setSortType("date")}>
                    <FaSortNumericDown size={18} /> Sort by Date
                </Button>
            </div>

            <FoodList userId={user.id} photos={photos} deletePhoto={deletePhoto} updatePhotoName={updatePhotoName} />
        </div>
    )
}