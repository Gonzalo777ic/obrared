import { PUBLISHER_TYPES } from "@/constants/publisher-type";
import {
  mapWorkerProfile,
  workerProfileInclude,
} from "@/lib/mappers/worker-profile";
import { activeOnly, prisma } from "@/lib/prisma";
import type { WorkerProfile } from "@/types/worker";

type GetPublicWorkersOptions = {
  publisherType?: string;
};

export async function getPublicWorkers(
  options: GetPublicWorkersOptions = {},
): Promise<WorkerProfile[]> {
  const workers = await prisma.workerProfile.findMany({
    where: {
      ...activeOnly,
      ...(options.publisherType
        ? { publisherType: options.publisherType }
        : {}),
    },
    include: workerProfileInclude,
    orderBy: [{ subscriptionScore: "desc" }, { updatedAt: "desc" }],
  });

  return workers.map(mapWorkerProfile);
}

export async function getPublicIndividualWorkers() {
  return getPublicWorkers({
    publisherType: PUBLISHER_TYPES.individual.value,
  });
}

export async function getPublicCompanyWorkers() {
  return getPublicWorkers({
    publisherType: PUBLISHER_TYPES.company.value,
  });
}

export async function getGuestHomeData() {
  const { getHomeCatalog } = await import("@/lib/queries/catalog");
  const [workers, catalog] = await Promise.all([
    getPublicWorkers(),
    getHomeCatalog(),
  ]);

  return { workers, catalog };
}

export async function getWorkersDirectoryData() {
  const { getHomeCatalog } = await import("@/lib/queries/catalog");
  const [workers, catalog] = await Promise.all([
    getPublicIndividualWorkers(),
    getHomeCatalog(),
  ]);

  return { workers, catalog };
}

export async function getCompaniesDirectoryData() {
  const { getHomeCatalog } = await import("@/lib/queries/catalog");
  const [workers, catalog] = await Promise.all([
    getPublicCompanyWorkers(),
    getHomeCatalog(),
  ]);

  return { workers, catalog };
}
