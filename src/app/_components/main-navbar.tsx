"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

import { MAIN_NAV_ITEMS } from "@/constants/navigation";

type MainNavbarProps = {
  authArea: ReactNode;
};

export function MainNavbar({ authArea }: MainNavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden shrink-0 border-b border-amber-600 bg-amber-500 lg:block">
      <div className="flex h-16 items-center gap-6 px-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/webp/logo-horizontal.webp"
            alt="ObraRed"
            width={180}
            height={56}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav
          className="flex min-w-0 flex-1 items-center gap-1"
          aria-label="Navegación principal"
        >
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-600/50 text-slate-900"
                    : "text-slate-900/80 hover:bg-amber-600/30 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center">{authArea}</div>
      </div>
    </header>
  );
}
