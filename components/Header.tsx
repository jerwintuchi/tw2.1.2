import React from "react";
import { IoAppsSharp } from "react-icons/io5";
import { ThemeSwitcher } from "./theme-switcher";
import { getUser } from "@/utils/supabase/user-helpers-server";
import SignOutButton from "./buttons/signout-button";
import Link from "next/link";
import NavLinks from "./NavLinks/NavLinks";


export default async function Header() {
    const user = await getUser();

    return (
        <header className="sticky top-0 z-50 w-full dark:bg-background bg-white shadow-md">
            <nav className="w-full border-b flex items-center h-16 px-4 sm:px-8">
                {/* Left - Logo & Title */}
                <div className="flex items-center">
                    <IoAppsSharp size={36} className="mr-2 text-green-500" />
                    <Link href={"/"} className="text-2xl font-bold hover:text-green-500 transition ">
                        <div className="font-semibold sm:text-4xl text-lg">
                            TW 2.1.2
                        </div>
                    </Link>
                </div>

                {/* Center - Navigation Links (Only for Desktop) */}
                {user && (
                    <div className="hidden md:flex flex-1 justify-center">
                        <NavLinks />
                    </div>
                )}

                {/* Right - Theme Switcher, Sign Out Button, & Hamburger Button */}
                <div className="flex items-center ml-auto space-x-2 md:space-x-2">
                    {/* ThemeSwitcher */}
                    <ThemeSwitcher />

                    {/* Sign Out or Sign In Button */}
                    {user ? (
                        <SignOutButton />
                    ) : (
                        <Link
                            href="/sign-in"
                            className="px-4 py-2 border rounded-lg hover:bg-green-500 hover:text-white transition"
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Mobile Hamburger Menu Button (Only on Mobile) */}
                    <div className="md:hidden flex items-center">
                        {user && <NavLinks />}
                    </div>
                </div>
            </nav>
        </header>
    );
}
