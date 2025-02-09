import { getUser } from "@/utils/supabase/user-helpers-server";
import FoodReviewManager from "./_components/FoodReviewManager";


export default async function Food() {
    const user = await getUser();
    if (!user) return null;


    return <FoodReviewManager user={user} />;
}