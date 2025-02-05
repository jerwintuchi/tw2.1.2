import React from 'react'
import TodoList from './_components/TodoList'
import { getUser } from '@/utils/supabase/user-helpers'

export default async function TodosPage() {
    const user = await getUser()
    if(!user){
        console.log("Notlogged in");
        return null;
    }
  return (
    <TodoList user={user}/>
  )
}
