// app/drive/page.tsx (Server Component)

import { getUser } from "@/utils/supabase/user-helpers";
import PhotoManager from "./_components/PhotoManager";




export default async function Drive() {
    const user = await getUser();
    if (!user) return null;

    return <PhotoManager user={user} />;
}
