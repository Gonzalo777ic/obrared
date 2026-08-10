"use client";

import { ChevronDown, LayoutList, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { signOutAction } from "@/app/_actions/auth";
import { getInitials } from "@/constants/roles";
import {
  shouldShowAdsPanelCta,
  shouldShowOfferServicesCta,
  USER_MENU_ITEMS,
  WORKER_NAV_CTA,
} from "@/constants/user-nav";

type UserAuthAreaProps = {
  email?: string | null;
  fullName?: string | null;
  roleName?: string | null;
  roleSlug?: string | null;
  hasPublicWorkerProfile?: boolean;
  isAuthenticated?: boolean;
};

export function UserAuthArea({
  email,
  fullName,
  roleName,
  roleSlug,
  hasPublicWorkerProfile = false,
  isAuthenticated = false,
}: UserAuthAreaProps) {
  const router = useRouter();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  if (!isAuthenticated && !email) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={WORKER_NAV_CTA.offerServices.href}
          className="hidden rounded-md border border-slate-900/20 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-white sm:inline-flex"
        >
          {WORKER_NAV_CTA.offerServices.shortLabel}
        </Link>
        <Link
          href="/auth"
          className="inline-flex items-center justify-center bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const initials = getInitials(fullName, email ?? "OR");
  const displayName = fullName?.trim() || email || "Usuario";
  const displayRole = roleName ?? "Perfil pendiente";
  const showOfferCta = shouldShowOfferServicesCta(roleSlug, hasPublicWorkerProfile);
  const showPanelCta = shouldShowAdsPanelCta(roleSlug, hasPublicWorkerProfile);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutAction();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {showOfferCta ? (
        <Link
          href={WORKER_NAV_CTA.offerServices.href}
          className="inline-flex items-center justify-center rounded-md border border-slate-900 bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-slate-900 transition-colors hover:bg-white sm:px-3 sm:py-2 sm:text-xs"
        >
          <span className="sm:hidden">{WORKER_NAV_CTA.offerServices.shortLabel}</span>
          <span className="hidden sm:inline">
            {WORKER_NAV_CTA.offerServices.label}
          </span>
        </Link>
      ) : null}

      {showPanelCta ? (
        <Link
          href={WORKER_NAV_CTA.adsPanel.href}
          className="inline-flex items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-amber-500 transition-colors hover:bg-slate-800 sm:px-3 sm:py-2 sm:text-xs"
        >
          <span className="sm:hidden">{WORKER_NAV_CTA.adsPanel.shortLabel}</span>
          <span className="hidden sm:inline">{WORKER_NAV_CTA.adsPanel.label}</span>
        </Link>
      ) : null}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-slate-900/10"
        >
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-slate-900">{displayName}</p>
            <p className="text-[11px] text-slate-500">{displayRole}</p>
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-amber-500"
            aria-hidden="true"
          >
            {initials}
          </div>
          <ChevronDown
            className={`hidden h-4 w-4 text-slate-700 transition-transform sm:block ${
              menuOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {menuOpen ? (
          <div
            id={menuId}
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 border border-slate-200 bg-white py-1 shadow-lg"
          >
            <div className="border-b border-slate-100 px-3 py-2 sm:hidden">
              <p className="text-sm font-medium text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-500">{displayRole}</p>
            </div>

            {showPanelCta ? (
              <Link
                href={WORKER_NAV_CTA.adsPanel.href}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <LayoutList
                  className="h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                {WORKER_NAV_CTA.adsPanel.label}
              </Link>
            ) : null}

            <Link
              href={USER_MENU_ITEMS.settings.href}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 text-slate-400" aria-hidden="true" />
              {USER_MENU_ITEMS.settings.label}
            </Link>

            <button
              type="button"
              role="menuitem"
              disabled={isSigningOut}
              onClick={() => void handleSignOut()}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {isSigningOut ? "Cerrando..." : USER_MENU_ITEMS.signOut.label}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
