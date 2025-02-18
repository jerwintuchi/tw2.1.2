"use client";
import { ValidRoutes } from "@/app/types/type-definitions";
import showErrorToast from "@/components/toasts/ErrorToast";
import { showPromiseToast } from "@/components/toasts/PromiseToast";
import showSuccessToast from "@/components/toasts/SuccessToast";
import { useState, useEffect } from "react";

export interface Photo {
  id: string;
  user_id: string;
  photo_url: string;
  photo_name: string;
  created_at: string;
}

export function usePhoto(userId: string, apiRoute: ValidRoutes) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("date");

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `/api/${apiRoute}?userId=${userId}&sortType=${sortType}`
        );
        const data = await response.json();
        if (!data) throw new Error("No data");
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error);
        showErrorToast({ message: "Failed to load photos!" });
      }
    };

    fetchPhotos();
  }, [userId, sortType]);

  const filteredPhotos = photos.filter((photo) =>
    photo.photo_name.toLowerCase().includes(search.toLowerCase())
  );

  const uploadPhotos = async (files: FileList) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("userId", userId);

      const existingPhotoNames = new Set(
        photos.map((photo) => photo.photo_name)
      );
      const filteredFiles = Array.from(files).filter(
        (file) => !existingPhotoNames.has(file.name)
      );

      if (filteredFiles.length === 0) {
        // Show error toast only for already uploaded files
        showErrorToast({ message: "That file(s) is already uploaded." });
        setUploading(false);
        return; // Exit early to prevent success toast from being shown
      }

      // Proceed to upload the filtered files
      filteredFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`/api/${apiRoute}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload photo");

      const data = await response.json();
      const newPhotos = data as Photo[];

      setPhotos((prev) => [...newPhotos, ...prev]); // Update photos state with new photos
      showSuccessToast({ message: "Photos uploaded successfully!" });
    } catch (error: any) {
      console.error("Error uploading photos:", error);
      showErrorToast({ message: error.message });
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id: string, photo_url: string) => {
    try {
      const response = await fetch(
        `/api/${apiRoute}?id=${id}&photo_url=${photo_url}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        showErrorToast({ message: "Failed to delete photo" });
        return;
      }

      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
      showSuccessToast({ message: "Photo deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      showErrorToast({ message: error.message });
    }
  };

  const updatePhotoName = async (id: string, newName: string) => {
    try {
      const response = await fetch(
        `/api/${apiRoute}?id=${id}&newName=${newName}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, newName }),
        }
      );

      if (!response.ok) {
        showErrorToast({ message: "Failed to update photo name" });
        return;
      }

      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === id ? { ...photo, photo_name: newName } : photo
        )
      );
    } catch (error: any) {
      console.error("Error updating photo name:", error);
      showErrorToast({ message: error.message });
    }
  };

  return {
    photos: filteredPhotos,
    uploading,
    search,
    setSearch,
    sortType,
    setSortType,
    uploadPhotos,
    deletePhoto,
    updatePhotoName,
  };
}
