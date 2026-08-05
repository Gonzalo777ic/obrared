"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { type ReactNode } from "react";

type TopbarProps = {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  authArea: ReactNode;
};

export function Topbar({
  sidebarOpen,
  onToggleSidebar,
  authArea,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100"
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="flex items-center">
        <Image
          src="/webp/logo-horizontal.webp"
          alt="ObraRed"
          width={180}
          height={56}
          className="h-10 w-auto"
          priority
        />
      </div>

      <div className="ml-auto flex items-center">{authArea}</div>
    </header>
  );
}
