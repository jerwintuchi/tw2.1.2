import { createClient } from "./client";

export const getUserName = async (userId: string) => {
  const supabase = createClient();

  const username = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", userId)
    .single();
  if (!username.data) {
    console.log("Cannot find username");
    return null;
  }

  return username.data?.username;
};
