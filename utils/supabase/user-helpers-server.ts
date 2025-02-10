import { UserWithUsername } from "@/app/types/type-definitions";
import { createClient } from "./server";

export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const getUserName = async (userId: string) => {
  const supabase = await createClient();

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

export const getUserWithUsername = async () => {
  const user = await getUser();
  if (!user) return null;

  const username = await getUserName(user.id);
  if (!username) return null;

  return { supabaseUser: user, username: username } as UserWithUsername;
};
