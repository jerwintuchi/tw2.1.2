
import { createClient } from "@/utils/supabase/server";
import HomePage from "./_components/HomePage";
import LandingPage from "./_components/LandingPage";

export default async function Root() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user", user);
  return user ?
    <HomePage user={user} /> : <LandingPage />

}
