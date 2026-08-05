import type { WorkCategoryOption } from "@/types/catalog";
import type { WorkerProfile } from "@/types/worker";

export type WorkerSearchFilters = {
  specialty: string;
  machinery: string;
  availability: string;
  departmentCode: string;
  cityCode: string;
  districtCode: string;
  category: string;
};

export const EMPTY_SEARCH_FILTERS: WorkerSearchFilters = {
  specialty: "",
  machinery: "",
  availability: "",
  departmentCode: "",
  cityCode: "",
  districtCode: "",
  category: "",
};

export function filterWorkers(
  workers: WorkerProfile[],
  filters: WorkerSearchFilters,
  categories: WorkCategoryOption[],
): WorkerProfile[] {
  const categorySpecialties = filters.category
    ? categories.find((item) => item.value === filters.category)?.specialtySlugs
    : undefined;

  return workers.filter((worker) => {
    if (filters.specialty && worker.specialtySlug !== filters.specialty) {
      return false;
    }

    if (filters.machinery && worker.machinerySlug !== filters.machinery) {
      return false;
    }

    if (
      filters.availability &&
      worker.availabilitySlug !== filters.availability
    ) {
      return false;
    }

    if (
      filters.departmentCode &&
      worker.departmentCode !== filters.departmentCode
    ) {
      return false;
    }

    if (filters.cityCode && worker.cityCode !== filters.cityCode) {
      return false;
    }

    if (filters.districtCode && worker.districtCode !== filters.districtCode) {
      return false;
    }

    if (
      categorySpecialties &&
      !categorySpecialties.includes(worker.specialtySlug)
    ) {
      return false;
    }

    return true;
  });
}

export function sortByUpdatedDesc(workers: WorkerProfile[]): WorkerProfile[] {
  return [...workers].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getFeaturedWorkers(workers: WorkerProfile[]): WorkerProfile[] {
  return sortByUpdatedDesc(
    workers.filter((worker) => worker.isFeatured || worker.isVerified),
  );
}
