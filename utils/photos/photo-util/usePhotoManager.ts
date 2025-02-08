"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface Photo {
  id: string;
  user_id: string;
  photo_url: string;
  photo_name: string;
  created_at: string;
}

export function usePhotoManager(userId: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("date");
  const supabase = createClient();

  // Fetch photos when userId changes
  useEffect(() => {
    if (!userId) return; // Prevent running if userId is missing

    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("user_id", userId)
        .order(sortType === "name" ? "photo_name" : "created_at", {
          ascending: true,
        });

      if (error) {
        console.error("Error fetching photos:", error);
      } else {
        setPhotos(data || []);
      }
    };

    fetchPhotos();
  }, [userId, sortType]); // Only refetch when userId or sortType changes

  // Upload Photo
  const uploadPhotos = async (files: FileList) => {
    try {
      setUploading(true);
      const newPhotos: Photo[] = [];

      for (const file of Array.from(files)) {
        const { data: existingPhotos, error: fetchError } = await supabase
          .from("photos")
          .select("*")
          .eq("user_id", userId)
          .eq("photo_name", file.name);

        if (fetchError) throw fetchError;

        if (existingPhotos && existingPhotos.length > 0) {
          alert(`A file named "${file.name}" already exists. Rename it and try again.`);
          continue;
        }

        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `drive/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data, error } = await supabase
          .from("photos")
          .insert([{ user_id: userId, photo_name: file.name, photo_url: filePath }])
          .select()
          .single();

        if (error) throw error;

        newPhotos.push(data);
      }

      setPhotos((prev) => [...newPhotos, ...prev]);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Delete Photo
  const deletePhoto = async (id: string, photo_url: string) => {
    try {
      const { error: deleteStorageError } = await supabase.storage
        .from("photos")
        .remove([photo_url]);
      if (deleteStorageError) throw deleteStorageError;

      const { error: deleteDbError } = await supabase
        .from("photos")
        .delete()
        .eq("id", id);
      if (deleteDbError) throw deleteDbError;

      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      alert(error.message);
    }
  };

  return {
    photos,
    uploading,
    search,
    setSearch,
    sortType,
    setSortType,
    uploadPhotos,
    deletePhoto,
  };
}
