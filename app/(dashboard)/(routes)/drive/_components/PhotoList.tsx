"use client";
import { getImageSrc } from "@/utils/getImgSrc";
import { Trash2 } from "lucide-react"
import Image from "next/image"


interface PhotoListProps {
    photos: { id: string; photo_name: string; photo_url: string }[]
    deletePhoto: (id: string, photo_url: string) => void
}

export const PhotoList: React.FC<PhotoListProps> = ({ photos, deletePhoto }) => {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {photos.map((photo) => (
                <li key={photo.id} className="relative group overflow-hidden rounded-lg shadow-md">
                    <div className="relative w-full h-80">
                        <Image
                            src={getImageSrc(photo.photo_url)}
                            alt={photo.photo_name}
                            width={600}
                            height={400}
                            objectFit="cover"
                            className="rounded-lg transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300">
                            <span className="absolute bottom-2 left-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {photo.photo_name}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => deletePhoto(photo.id, photo.photo_url)}
                        className="absolute top-2 right-2 bg-transparent text-red-500 hover:text-red-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <Trash2 size={16} />
                    </button>
                </li>
            ))}
        </ul>
    )
}
