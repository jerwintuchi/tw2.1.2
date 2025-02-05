
import React from 'react'
import { IoAppsSharp } from 'react-icons/io5'
import { ThemeSwitcher } from './theme-switcher'
import { getUser } from '@/utils/supabase/user-helpers';
import SignOutButton from './buttons/signout-button';


const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
//get user login status

export default async function Header() {
    //render SignIn/SignUp button dynamically based on route

    const user = await getUser();
    return (
        <div className="sticky top-0 z-50 w-full dark:bg-background bg-white">
            {/* Navigation Bar */}
            <div className="w-full border-b flex flex-row items-center h-16 px-8 ">
                <div className='flex flex-row hover:text-green-500 hover:cursor-grab hover:opacity-75  dark:hover:text-green-400 transition-opacity'>
                    <IoAppsSharp size={36} className='mr-2' />
                    {/* Left - App Title */}
                    <div className="font-semibold text-4xl">
                        <a href={defaultUrl}>TW 2.1.2
                        </a>
                    </div>
                </div>
                {/* Push ThemeSwitcher to the right */}
                <div className=" flex flex-row ml-auto gap-2">

                    {
                        user && (
                            <SignOutButton />
                        )
                    }


                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    )
}
