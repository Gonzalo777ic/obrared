"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MAIN_NAV_ITEMS } from "@/constants/navigation";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <div
        className={`fixed inset-0 z-30 bg-slate-950/60 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-slate-800 px-5">
          <span className="text-sm font-semibold tracking-wide text-white">
            Menú
          </span>
        </div>

        <nav
          className="flex flex-1 flex-col gap-1 p-3"
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
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-amber-500"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-600">
            ObraRed · v0.1
          </p>
        </div>
      </aside>
    </div>
  );
}
