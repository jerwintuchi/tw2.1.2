import React, { useRef } from "react"
import { UploadCloud } from "lucide-react"

interface PhotoUploaderProps {
    uploading: boolean
    uploadPhoto: (file: File) => void
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ uploading, uploadPhoto }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadPhoto(e.target.files[0])
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors">
            <UploadCloud size={48} className="text-gray-500 mb-4" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 15MB)</p>
            <input
                ref={inputRef}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
                disabled={uploading}
            />
        </div>
    )
}
