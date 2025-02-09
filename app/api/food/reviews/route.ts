import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET: Fetch reviews
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
      .select(
        `
        id, 
        user_id, 
        review, 
        rating, 
        created_at, 
        profiles (username)
      `
      )
      .eq("food_photo_id", foodPhotoId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    //  Cache results
    return NextResponse.json(
      data.map((review) => ({
        ...review,
        username: review.profiles?.username ?? "Unknown",
        profiles: undefined, // Remove nested profiles object
      })),
      {
        status: 200,
        headers: { "Cache-Control": "no-store, must-revalidate" },
      }
    );
  } catch (err) {
    console.error("Unexpected API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//  POST: Add reviews
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { foodPhotoId, review, rating, userId } = await req.json();

    if (!foodPhotoId || !review || !rating || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("food_reviews")
      .insert([
        {
          food_photo_id: foodPhotoId,
          user_id: userId,
          review,
          rating,
          created_at: new Date().toISOString(),
        },
      ])
      .select();
    if (review.length > 250) {
      return NextResponse.json({ error: "Review too long" }, { status: 400 });
    }

    if (error) {
      console.error("Database Insert Error:", error);
      return NextResponse.json(
        { error: "Failed to add review", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 201 });
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
