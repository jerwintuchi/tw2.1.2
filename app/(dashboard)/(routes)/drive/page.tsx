import { getUser } from '@/utils/supabase/user-helpers';
import React from 'react'
import PhotoManager from './_components/PhotoManager';

export default async function Drive() {
    const user = await getUser();
    if (!user) return null;

    return (
        <PhotoManager user={user} />
    )
}
