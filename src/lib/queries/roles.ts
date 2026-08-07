import { DEFAULT_ROLE_SLUG } from "@/constants/roles";
import { activeCatalogWhere, prisma } from "@/lib/prisma";

export async function getRoleBySlug(slug: string) {
  return prisma.role.findFirst({
    where: {
      slug,
      ...activeCatalogWhere,
    },
  });
}

export async function getDefaultRole() {
  const role = await getRoleBySlug(DEFAULT_ROLE_SLUG);
  if (!role) {
    throw new Error(
      "Rol cliente no encontrado. Ejecuta pnpm db:seed para inicializar roles.",
    );
  }

  return role;
}

export async function listActiveRoles() {
  return prisma.role.findMany({
    where: activeCatalogWhere,
    orderBy: { sortOrder: "asc" },
  });
}
