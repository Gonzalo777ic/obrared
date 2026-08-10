import { DEFAULT_ROLE_SLUG } from "@/constants/roles";
import { activeCatalogWhere, prisma } from "@/lib/prisma";

export const ROLES_NOT_SEEDED_MESSAGE =
  "Roles no inicializados. Ejecuta: pnpm db:push && pnpm db:seed";

export async function getRoleBySlug(slug: string) {
  return prisma.role.findFirst({
    where: {
      slug,
      ...activeCatalogWhere,
    },
  });
}

export async function getDefaultRole() {
  return getRoleBySlug(DEFAULT_ROLE_SLUG);
}

export async function listActiveRoles() {
  return prisma.role.findMany({
    where: activeCatalogWhere,
    orderBy: { sortOrder: "asc" },
  });
}

export async function hasSeededRoles() {
  const count = await prisma.role.count({
    where: activeCatalogWhere,
  });

  return count > 0;
}
