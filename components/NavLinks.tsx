"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function NavLinks() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center space-x-6 text-lg font-medium">
                <li>
                    <Link href="/" className="hover:text-green-500 transition">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard" className="hover:text-green-500 transition">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/profile" className="hover:text-green-500 transition">
                        Profile
                    </Link>
                </li>
            </ul>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-950 shadow-lg flex flex-col items-center py-4">
                    <Link href="/" className="py-2 text-lg font-medium hover:text-green-500 transition w-full text-center" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href="/todos" className="py-2 text-lg font-medium hover:text-green-500 transition w-full text-center" onClick={() => setMenuOpen(false)}>
                        Todo
                    </Link>
                    <Link href="/profile" className="py-2 text-lg font-medium hover:text-green-500 transition w-full text-center" onClick={() => setMenuOpen(false)}>
                        Profile
                    </Link>
                </div>
            )}
        </>
    );
}
