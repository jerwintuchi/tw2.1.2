import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const foodPhotoId = url.searchParams.get("foodPhotoId");

    if (!foodPhotoId) {
      return NextResponse.json(
        { error: "Missing foodPhotoId" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("food_reviews")
      .select("*")
      .eq("food_photo_id", foodPhotoId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    console.log("Received review data:", body); // Debugging

    const { foodPhotoId, review, rating, userId } = body;

    if (!foodPhotoId || !review || !rating || !userId) {
      console.error("Missing required fields:", {
        foodPhotoId,
        review,
        rating,
        userId,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = {
      food_photo_id: foodPhotoId,
      user_id: userId,
      review,
      rating,
      created_at: new Date().toISOString(),
    };

    console.log("Inserting review:", newReview); // For Debugging

    const { data, error } = await supabase
      .from("food_reviews")
      .insert([newReview])
      .select()
      .single();

    if (error) {
      console.error("Database Insert Error:", error); // For Debugging
      return NextResponse.json(
        { error: "Failed to add review", details: error.message },
        { status: 500 }
      );
    }

    console.log("Review added successfully:", data); // Debugging
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
  }

  const { error } = await supabase.from("food_reviews").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Review deleted" }, { status: 200 });
}
