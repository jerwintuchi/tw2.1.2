"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 🚀 GET: Fetch photos efficiently
export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const sortType = searchParams.get("sortType") || "date";

  const { data, error } = await supabase
    .from("food_photos")
    .select("*")
    .order(sortType === "name" ? "photo_name" : "created_at", {
      ascending: true,
    });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  //  always fetch fresh data
  return NextResponse.json(data, {
    status: 200,
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}

// POST: Upload photos in parallel using Promise.all()
export async function POST(req: Request) {
  const supabase = await createClient();
  const formData = await req.formData();
  const userId = formData.get("userId") as string;
  const files = formData.getAll("files") as File[];

  if (!userId || !files.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const uploadedPhotos = await Promise.all(
    files.map(async (file) => {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `drive/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadError) throw new Error(uploadError.message);

      const { data, error } = await supabase
        .from("food_photos")
        .insert([
          { user_id: userId, photo_name: file.name, photo_url: filePath },
        ])
        .select();

      if (error) throw new Error(error.message);

      return data[0];
    })
  );

  return NextResponse.json(uploadedPhotos, { status: 200 });
}

// DELETE: Batch delete photos to minimize API calls
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const ids = searchParams.getAll("id");
  const photoUrls = searchParams.getAll("photo_url");

  if (!ids.length || !photoUrls.length) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const deleteStorage = supabase.storage.from("photos").remove(photoUrls);
  const deleteDb = supabase.from("food_photos").delete().in("id", ids);

  const [{ error: deleteStorageError }, { error: deleteDbError }] =
    await Promise.all([deleteStorage, deleteDb]);

  if (deleteStorageError || deleteDbError) {
    return NextResponse.json(
      { error: "Failed to delete photos" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Photos deleted successfully" },
    { status: 200 }
  );
}

// PATCH: Update photo name
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { id, newName } = await req.json();

  if (!id || !newName) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("food_photos")
    .update({ photo_name: newName })
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
