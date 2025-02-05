"use client";
// components/NavLinks/NavLinks.tsx

import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { LuListTodo } from "react-icons/lu";
import { FaGoogleDrive } from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";
import { MdCatchingPokemon } from "react-icons/md";
import { AiFillFileMarkdown } from "react-icons/ai";

import DesktopNavLinks from "./DesktopNavLinks";
import MobileNavLinks from "./MobileNavLinks";
import { NavLink } from "@/app/types/type-definitions";


const navLinks: NavLink[] = [
    {
        href: "/todos",
        label: "Todo",
        icon: LuListTodo
    },
    {
        href: "/drive",
        label: "GDrive Lite",
        icon: FaGoogleDrive
    },
    {
        href: "/food",
        label: "Food Review",
        icon: IoFastFood
    },
    {
        href: "/pokemon",
        label: "Pokemon Review",
        icon: MdCatchingPokemon
    },
    {
        href: "/markdown",
        label: "Markdown",
        icon: AiFillFileMarkdown
    },
];

export default function NavLinks() {
    const [menuOpen, setMenuOpen] = useState(false);
    const activityRoutes = navLinks;

    return (
        <>
            {/* Desktop Navigation Links */}
            {activityRoutes.map((routes) => (
                <div key={routes.href} className="hidden md:flex items-center space-x-6 text-lg font-medium">
                    <DesktopNavLinks href={routes.href} label={routes.label} icon={routes.icon} />
                </div>
            ))}

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div
                    className="md:hidden fixed top-0 left-0 w-full h-screen bg-black bg-opacity-60 flex flex-col items-center justify-center space-y-4 z-50"
                    onClick={() => setMenuOpen(false)} // Close the menu when clicking outside
                >
                    <div
                        className="bg-white w-full max-w-sm mx-auto rounded-lg p-4 space-y-4 border border-gray-300 shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent closing the menu when clicking inside
                    >
                        {activityRoutes.map((routes) => (
                            <MobileNavLinks
                                menuOpen={menuOpen}
                                setMenuOpen={setMenuOpen}
                                key={routes.href}
                                icon={routes.icon}
                                label={routes.label}
                                href={routes.href}
                            />
                        ))}
                    </div>
                </div>
            )}

        </>
    );
}
