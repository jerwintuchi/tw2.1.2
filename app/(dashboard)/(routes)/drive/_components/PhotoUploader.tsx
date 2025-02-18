"use client";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { showPromiseToast } from "@/components/toasts/PromiseToast";
import type React from "react";
import showErrorToast from "@/components/toasts/ErrorToast";

interface PhotoUploaderProps {
    uploading: boolean;
    uploadPhotos: (files: FileList) => Promise<void>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Maximum file size 5MB

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
    uploading,
    uploadPhotos,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = e.target.files;
            // Check if any file exceeds the size limit
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > MAX_FILE_SIZE) {
                    showErrorToast({ message: "File size exceeds the 5MB limit!" }); // Show error toast for file size exceed
                    return;
                }
            }

            // Call uploadPhotos only once after validation
            showPromiseToast(uploadPhotos(files), {
                loading: "Uploading...",
                success: "Photos uploaded successfully!",
                error: "Error in uploading photos",
            });

            e.target.value = ""; // Reset input after uploading
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = e.dataTransfer.files;
            // Check if any file exceeds the size limit
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > MAX_FILE_SIZE) {
                    showErrorToast({ message: "File size exceeds the 5MB limit!" }); // Show error toast for file size exceed
                    return;
                }
            }
            // Reset input after uploading
            if (inputRef.current) {
                inputRef.current.value = "";
            }

            // Call uploadPhotos only once after validation
            showPromiseToast(uploadPhotos(files), {
                loading: "Uploading...",
                success: "",
                error: "Error in uploading photos",
            });
        }
    };

    return (
        <div
            data-testid="photo-uploader"
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors ${dragActive ? "border-green-500 bg-green-700/25" : "border-gray-300"
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <UploadCloud size={48} className="text-gray-500 mb-4" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Supports multiple files (SVG, PNG, JPG, GIF)</p>
            <input
                ref={inputRef}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
                disabled={uploading}
                multiple
            />
        </div>
    );
};
