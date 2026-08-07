export const ROLE_SLUGS = {
  ADMIN: "admin",
  CLIENTE: "cliente",
  ANUNCIANTE: "anunciante",
  TRABAJADOR: "trabajador",
  EMPRESA: "empresa",
} as const;

export type RoleSlug = (typeof ROLE_SLUGS)[keyof typeof ROLE_SLUGS];

export const DEFAULT_ROLE_SLUG: RoleSlug = ROLE_SLUGS.CLIENTE;

export function getInitials(fullName: string | null | undefined, email: string) {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return `${first}${last}`.toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
}
