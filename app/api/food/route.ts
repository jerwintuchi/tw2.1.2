"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


// GET: Fetch photos for a user
export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const sortType = searchParams.get("sortType") || "date";

  //fetch photos from food_photos table
  const { data, error } = await supabase
    .from(`food_photos`)
    .select("*")
    .order(sortType === "name" ? "photo_name" : "created_at", {
      ascending: true,
    });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}

// POST: Upload new photos (multiple files)
export async function POST(req: Request) {
  const supabase = await createClient();
  const formData = await req.formData();
  const userId = formData.get("userId") as string; // casted to string since it is of type FormDataEntryValue

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const uploadedPhotos = [];

  for (const file of files) {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `drive/${fileName}`;
    //upload files into 'photos' storage bucket
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    //insert data into 'photos' table
    const { data, error } = await supabase
      .from(`food_photos`)
      .insert([{ user_id: userId, photo_name: file.name, photo_url: filePath }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    uploadedPhotos.push(data);
  }

  return NextResponse.json(uploadedPhotos, { status: 200 });
}

// DELETE: Delete a photo by ID
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const photoUrl = searchParams.get("photo_url");

  if (!id || !photoUrl) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  //delete from 'photos' storage bucket
  const { error: deleteStorageError } = await supabase.storage
    .from("photos")
    .remove([photoUrl]);

  if (deleteStorageError) {
    return NextResponse.json(
      { error: deleteStorageError.message },
      { status: 500 }
    );
  }
  //delete from food_photos table
  const { error: deleteDbError } = await supabase
    .from("food_photos")
    .delete()
    .eq("id", id);

  if (deleteDbError) {
    return NextResponse.json({ error: deleteDbError.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Photo deleted successfully" },
    {
      status: 200,
    }
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
    .from("photos")
    .update({ photo_name: newName })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
