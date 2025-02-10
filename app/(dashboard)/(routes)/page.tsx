
import { createClient } from "@/utils/supabase/server";
import HomePage from "./_components/HomePage";
import LandingPage from "./_components/LandingPage";
import {  getUserWithUsername } from "@/utils/supabase/user-helpers-server";

export default async function Root() {
  const user = await getUserWithUsername();

  console.log("user", user);
  return user ?
    <HomePage user={user} /> : <LandingPage />

}
