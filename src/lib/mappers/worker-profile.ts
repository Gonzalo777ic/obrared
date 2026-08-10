import type { Prisma } from "@/generated/prisma/client";

export const workerProfileInclude = {
  level: true,
  availability: true,
  specialties: {
    include: { specialty: true },
  },
  categories: {
    include: { category: true },
  },
  machinery: {
    include: { machinery: true },
  },
  coverageDistricts: true,
  images: {
    where: { isDeleted: false },
    orderBy: { sortOrder: "asc" },
  },
} satisfies Prisma.WorkerProfileInclude;

export type WorkerProfileRecord = Prisma.WorkerProfileGetPayload<{
  include: typeof workerProfileInclude;
}>;

function formatSpecialtyLabel(items: { name: string }[]) {
  if (items.length === 0) return "Sin especialidad";
  if (items.length === 1) return items[0].name;
  return `${items[0].name} +${items.length - 1}`;
}

function formatCategoryLabel(items: { name: string }[]) {
  if (items.length === 0) return "Sin categoría";
  if (items.length === 1) return items[0].name;
  return `${items[0].name} +${items.length - 1}`;
}

function formatMachineryLabel(items: { slug: string; name: string }[]) {
  const filtered = items.filter((item) => item.slug !== "ninguna");
  if (filtered.length === 0) return "Sin maquinaria";
  if (filtered.length === 1) return filtered[0].name;
  return `${filtered[0].name} +${filtered.length - 1}`;
}

export function mapWorkerProfile(worker: WorkerProfileRecord) {
  const specialties = worker.specialties.map((item) => item.specialty);
  const categories = worker.categories.map((item) => item.category);
  const machinery = worker.machinery.map((item) => item.machinery);
  const primarySpecialty = specialties[0];
  const primaryMachinery =
    machinery.find((item) => item.slug !== "ninguna") ?? machinery[0];

  const isCompany = worker.publisherType === "company";
  const displayLabel = isCompany
    ? formatCategoryLabel(categories)
    : formatSpecialtyLabel(specialties);

  return {
    id: worker.id,
    publisherType: worker.publisherType,
    fullName: worker.fullName,
    businessName: worker.businessName,
    whatsapp: worker.whatsapp,
    specialtySlug: primarySpecialty?.slug ?? "",
    specialtyName: displayLabel,
    specialtySlugs: specialties.map((item) => item.slug),
    categorySlugs: categories.map((item) => item.slug),
    categoryNames: categories.map((item) => item.name),
    levelSlug: worker.level?.slug ?? "",
    levelName: isCompany ? "Empresa" : worker.level?.name ?? "",
    machinerySlug: primaryMachinery?.slug ?? "ninguna",
    machineryName: formatMachineryLabel(machinery),
    machinerySlugs: machinery.map((item) => item.slug),
    availabilitySlug: worker.availability.slug,
    availabilityName: worker.availability.name,
    departmentCode: worker.departmentCode,
    departmentName: worker.departmentName,
    cityCode: worker.cityCode,
    cityName: worker.cityName,
    districtCode: worker.districtCode,
    districtName: worker.districtName,
    coverageDistricts: worker.coverageDistricts.map((item) => ({
      districtCode: item.districtCode,
      districtName: item.districtName,
      cityCode: item.cityCode,
      cityName: item.cityName,
      departmentCode: item.departmentCode,
      departmentName: item.departmentName,
    })),
    subscriptionScore: worker.subscriptionScore,
    updatedAt: worker.updatedAt.toISOString(),
    images: worker.images.map((image) => ({
      id: image.id,
      url: image.url,
      altText: image.altText,
      description: image.description,
      sortOrder: image.sortOrder,
    })),
  };
}
