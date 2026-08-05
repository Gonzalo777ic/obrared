import { activeCatalogWhere, prisma } from "@/lib/prisma";
import type { HomeCatalog } from "@/types/catalog";

function toOption<T extends { slug: string; name: string }>(item: T) {
  return { value: item.slug, label: item.name };
}

export async function getHomeCatalog(): Promise<HomeCatalog> {
  const [specialties, machineryTypes, availabilityStatuses, workerLevels, categories] =
    await Promise.all([
      prisma.specialty.findMany({
        where: activeCatalogWhere,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.machineryType.findMany({
        where: activeCatalogWhere,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.availabilityStatus.findMany({
        where: activeCatalogWhere,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.workerLevel.findMany({
        where: activeCatalogWhere,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.workCategory.findMany({
        where: activeCatalogWhere,
        orderBy: { sortOrder: "asc" },
        include: {
          specialties: {
            include: { specialty: true },
          },
        },
      }),
    ]);

  return {
    specialties: specialties.map(toOption),
    machineryTypes: machineryTypes.map(toOption),
    availabilityStatuses: availabilityStatuses.map(toOption),
    workerLevels: workerLevels.map(toOption),
    categories: categories.map((category) => ({
      value: category.slug,
      label: category.name,
      specialtySlugs: category.specialties.map((item) => item.specialty.slug),
    })),
  };
}
