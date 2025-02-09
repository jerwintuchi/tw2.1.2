import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch the user's username
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
