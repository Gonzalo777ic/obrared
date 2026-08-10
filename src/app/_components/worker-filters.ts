import {
  LOCATION_SEARCH_MODES,
  type LocationSearchMode,
} from "@/constants/worker-search";
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
  locationMode: LocationSearchMode;
};

export const EMPTY_SEARCH_FILTERS: WorkerSearchFilters = {
  specialty: "",
  machinery: "",
  availability: "",
  departmentCode: "",
  cityCode: "",
  districtCode: "",
  category: "",
  locationMode: LOCATION_SEARCH_MODES.manual,
};

function workerCoversDistrict(worker: WorkerProfile, districtCode: string) {
  if (worker.coverageDistricts.some((item) => item.districtCode === districtCode)) {
    return true;
  }

  return worker.districtCode === districtCode;
}

function workerCoversCity(worker: WorkerProfile, cityCode: string) {
  if (worker.coverageDistricts.some((item) => item.cityCode === cityCode)) {
    return true;
  }

  return worker.cityCode === cityCode;
}

function workerCoversDepartment(worker: WorkerProfile, departmentCode: string) {
  if (
    worker.coverageDistricts.some(
      (item) => item.departmentCode === departmentCode,
    )
  ) {
    return true;
  }

  return worker.departmentCode === departmentCode;
}

function getProximityScore(worker: WorkerProfile, filters: WorkerSearchFilters) {
  if (filters.districtCode) {
    if (workerCoversDistrict(worker, filters.districtCode)) return 0;
    if (filters.cityCode && workerCoversCity(worker, filters.cityCode)) return 1;
    if (
      filters.departmentCode &&
      workerCoversDepartment(worker, filters.departmentCode)
    ) {
      return 2;
    }
    return 3;
  }

  if (filters.cityCode) {
    if (workerCoversCity(worker, filters.cityCode)) return 0;
    if (
      filters.departmentCode &&
      workerCoversDepartment(worker, filters.departmentCode)
    ) {
      return 1;
    }
    return 2;
  }

  if (filters.departmentCode) {
    return workerCoversDepartment(worker, filters.departmentCode) ? 0 : 1;
  }

  return 0;
}

function matchesLocationFilter(
  worker: WorkerProfile,
  filters: WorkerSearchFilters,
) {
  if (filters.districtCode) {
    return workerCoversDistrict(worker, filters.districtCode);
  }

  if (filters.cityCode) {
    return workerCoversCity(worker, filters.cityCode);
  }

  if (filters.departmentCode) {
    return workerCoversDepartment(worker, filters.departmentCode);
  }

  return true;
}

export function filterWorkers(
  workers: WorkerProfile[],
  filters: WorkerSearchFilters,
  categories: WorkCategoryOption[],
): WorkerProfile[] {
  const categorySpecialties = filters.category
    ? categories.find((item) => item.value === filters.category)?.specialtySlugs
    : undefined;

  return workers.filter((worker) => {
    if (filters.specialty && !worker.specialtySlugs.includes(filters.specialty)) {
      return false;
    }

    if (
      filters.machinery &&
      !worker.machinerySlugs.includes(filters.machinery)
    ) {
      return false;
    }

    if (
      filters.availability &&
      worker.availabilitySlug !== filters.availability
    ) {
      return false;
    }

    if (!matchesLocationFilter(worker, filters)) {
      return false;
    }

    if (filters.category) {
      const matchesCategorySlug = worker.categorySlugs.includes(filters.category);
      const matchesCategorySpecialty = categorySpecialties?.some((slug) =>
        worker.specialtySlugs.includes(slug),
      );

      if (!matchesCategorySlug && !matchesCategorySpecialty) {
        return false;
      }
    }

    return true;
  });
}

export function sortWorkersByRank(
  workers: WorkerProfile[],
  filters: WorkerSearchFilters,
): WorkerProfile[] {
  return [...workers].sort((a, b) => {
    const scoreDiff = b.subscriptionScore - a.subscriptionScore;
    if (scoreDiff !== 0) return scoreDiff;

    const proximityDiff =
      getProximityScore(a, filters) - getProximityScore(b, filters);
    if (proximityDiff !== 0) return proximityDiff;

    return (
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  });
}

export function getRankedWorkers(
  workers: WorkerProfile[],
  filters: WorkerSearchFilters,
  categories: WorkCategoryOption[],
): WorkerProfile[] {
  return sortWorkersByRank(
    filterWorkers(workers, filters, categories),
    filters,
  );
}

export function getTopRankedWorkers(
  workers: WorkerProfile[],
  filters: WorkerSearchFilters,
  categories: WorkCategoryOption[],
  limit = 8,
): WorkerProfile[] {
  return getRankedWorkers(workers, filters, categories).slice(0, limit);
}

export function hasActiveLocationFilter(filters: WorkerSearchFilters) {
  return Boolean(
    filters.districtCode || filters.cityCode || filters.departmentCode,
  );
}
