import { getUserWithUsername } from '@/utils/supabase/user-helpers-server'
import React from 'react'
import PokemonClient from './_components/PokemonClient';

export default async function Pokemon() {
    const user = await getUserWithUsername();
    if (!user) return null;

    return (
        <PokemonClient user={user} />
    )
}
