import Link from "next/link";

import { getInitials, getRoleLabel } from "@/constants/roles";
import type { UserRole } from "@/generated/prisma/client";

type UserAuthAreaProps = {
  email?: string | null;
  fullName?: string | null;
  role?: UserRole | null;
};

export function UserAuthArea({ email, fullName, role }: UserAuthAreaProps) {
  if (!email || !role) {
    return (
      <Link
        href="/auth"
        className="inline-flex items-center justify-center bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
      >
        Iniciar sesión
      </Link>
    );
  }

  const initials = getInitials(fullName, email);

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-xs font-medium text-slate-900">
          {fullName?.trim() || email}
        </p>
        <p className="text-[11px] text-slate-500">{getRoleLabel(role)}</p>
      </div>
      <div
        className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-amber-500"
        aria-hidden="true"
      >
        {initials}
      </div>
    </div>
  );
}
