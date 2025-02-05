"use client";

import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { IconType } from 'react-icons';

interface MobileNavLinksProp {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    icon: IconType;
    label: string;
    href: string;
}

export default function MobileNavLinks({
    menuOpen,
    setMenuOpen,
    icon: Icon,
    label,
    href
}: MobileNavLinksProp) {
    const pathname = usePathname();
    const router = useRouter();

    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
        setMenuOpen(false); // Close the menu after clicking
    };

    return (
        <>
            {menuOpen && (
                <div className="w-full max-w-sm mx-auto bg-white rounded-lg border border-gray-300 shadow-lg">
                    <button
                        onClick={onClick}
                        type="button"
                        className={cn(
                            "flex items-center justify-center gap-x-3 text-slate-400 text-lg font-[500] py-4 w-full transition-all hover:text-green-500",
                            isActive && "text-green-500"
                        )}
                    >
                        <Icon
                            size={26}
                            className={cn(
                                "text-slate-400 transition-colors",
                                isActive && "text-green-500",
                                "group-hover:text-green-500"
                            )}
                        />
                        <span className="text-center">{label}</span>
                    </button>
                </div>
            )}
        </>
    );
}
