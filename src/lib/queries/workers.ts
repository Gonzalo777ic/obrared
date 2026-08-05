import {
  mapWorkerProfile,
  workerProfileInclude,
} from "@/lib/mappers/worker-profile";
import { activeOnly, prisma } from "@/lib/prisma";
import type { WorkerProfile } from "@/types/worker";

export async function getPublicWorkers(): Promise<WorkerProfile[]> {
  const workers = await prisma.workerProfile.findMany({
    where: activeOnly,
    include: workerProfileInclude,
    orderBy: { updatedAt: "desc" },
  });

  return workers.map(mapWorkerProfile);
}

export async function getGuestHomeData() {
  const { getHomeCatalog } = await import("@/lib/queries/catalog");
  const [workers, catalog] = await Promise.all([
    getPublicWorkers(),
    getHomeCatalog(),
  ]);

  return { workers, catalog };
}
