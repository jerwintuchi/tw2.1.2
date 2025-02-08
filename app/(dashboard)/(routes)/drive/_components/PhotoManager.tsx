"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhotoList } from "@/utils/photos/photo-component/photoList"
import { PhotoUploader } from "@/utils/photos/photo-component/photoUploader"
import { usePhotoManager } from "@/utils/photos/photo-util/usePhotoManager"
import { FaSortAlphaDown, FaSortNumericDown } from "react-icons/fa"


export default function PhotoManager({ user }: { user: any }) {
    const {
        photos,
        uploading,
        search,
        setSearch,
        sortType,
        setSortType,
        uploadPhotos,
        deletePhoto,
    } = usePhotoManager(user.id)

    return (
        <div className="flex flex-col gap-4 max-w-full mx-auto p-4">
            <h2 className="text-xl font-bold text-center">Manage your Photos</h2>

            <PhotoUploader uploading={uploading} uploadPhotos={uploadPhotos} />

            <Input
                type="text"
                placeholder="Search by photo name..."
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

            <PhotoList photos={photos} deletePhoto={deletePhoto} />
        </div>
    )
}
