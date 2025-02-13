import { getUser } from '@/utils/supabase/user-helpers-server'
import React from 'react'
import MarkdownNotes from './_components/MarkDownNotes';

export default async function Markdown() {
  const user = await getUser()
  if (!user) return null;


  return (
    <MarkdownNotes user={user} />
  )
}
