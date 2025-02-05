import { cn } from '@/lib/utils';

import { usePathname, useRouter } from 'next/navigation';

import React from 'react'
import { IconType } from 'react-icons';

interface DesktopNavLinksProps {
    href: string;
    label: string;
    icon: IconType;
}

export default function DesktopNavLinks({ href, label, icon: Icon }: DesktopNavLinksProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-400 text-lg font-[500] pl-6 transition-all hover:text-green-500",
                isActive && "text-green-500 dark:text-green-500"
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={26}
                    className={cn(
                        "text-black dark:text-white transition-colors",
                        isActive && "text-green-500 dark:text-green-500",
                        "group-hover:text-green-500" // Change icon color on sidebar hover
                    )}
                />
                {label}
            </div>
        </button>
    );
}
