import type { UserRole } from "@/generated/prisma/client";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  CLIENTE: "Cliente",
  ANUNCIANTE: "Anunciante",
  TRABAJADOR: "Trabajador",
  EMPRESA: "Empresa",
};

export const DEFAULT_USER_ROLE: UserRole = "CLIENTE";

export function getRoleLabel(role: UserRole): string {
  return USER_ROLE_LABELS[role];
}

export function getInitials(fullName: string | null | undefined, email: string) {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return `${first}${last}`.toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
}
