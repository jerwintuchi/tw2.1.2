"use client";
import { ValidRoutes } from "@/app/types/type-definitions";
import { useState, useEffect } from "react";

interface Photo {
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
        (file) => !existingPhotoNames.has(file.name) // Prevent duplicate name uploads
      );

      if (filteredFiles.length === 0) {
        alert("That file(s) is already uploaded.");
        setUploading(false);
        return;
      }

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
      setPhotos((prev) => [...newPhotos, ...prev]);
    } catch (error: any) {
      alert(error.message);
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

      if (!response.ok) console.log("Failed to delete photo");

      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      alert(error.message);
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
  };
}
