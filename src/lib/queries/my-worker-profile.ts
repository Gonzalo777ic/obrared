import {
  mapWorkerProfile,
  workerProfileInclude,
  type WorkerProfileRecord,
} from "@/lib/mappers/worker-profile";
import { activeOnly, prisma } from "@/lib/prisma";
import type { MyWorkerAd } from "@/types/worker";

function mapMyWorkerAd(worker: WorkerProfileRecord): MyWorkerAd {
  return {
    ...mapWorkerProfile(worker),
    presentation: worker.presentation,
    profilePhotoUrl: worker.profilePhotoUrl,
    yearsOfExperience: worker.yearsOfExperience,
    documentType: worker.documentType,
    documentNumber: worker.documentNumber,
    contactPersonName: worker.contactPersonName,
    contactPersonRole: worker.contactPersonRole,
  };
}

export async function getMyPublicWorkerProfile(
  userProfileId: string,
): Promise<MyWorkerAd | null> {
  const worker = await prisma.workerProfile.findFirst({
    where: {
      userProfileId,
      ...activeOnly,
    },
    include: workerProfileInclude,
  });

  if (!worker) return null;

  return mapMyWorkerAd(worker);
}

export async function userHasPublicWorkerProfile(userProfileId: string) {
  const count = await prisma.workerProfile.count({
    where: {
      userProfileId,
      ...activeOnly,
    },
  });

  return count > 0;
}
