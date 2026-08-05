import type { Prisma } from "@/generated/prisma/client";

export const workerProfileInclude = {
  specialty: true,
  level: true,
  machinery: true,
  availability: true,
} satisfies Prisma.WorkerProfileInclude;

export type WorkerProfileRecord = Prisma.WorkerProfileGetPayload<{
  include: typeof workerProfileInclude;
}>;

export function mapWorkerProfile(worker: WorkerProfileRecord) {
  return {
    id: worker.id,
    fullName: worker.fullName,
    specialtySlug: worker.specialty.slug,
    specialtyName: worker.specialty.name,
    levelSlug: worker.level.slug,
    levelName: worker.level.name,
    machinerySlug: worker.machinery.slug,
    machineryName: worker.machinery.name,
    availabilitySlug: worker.availability.slug,
    availabilityName: worker.availability.name,
    departmentCode: worker.departmentCode,
    departmentName: worker.departmentName,
    cityCode: worker.cityCode,
    cityName: worker.cityName,
    districtCode: worker.districtCode,
    districtName: worker.districtName,
    isFeatured: worker.isFeatured,
    isVerified: worker.isVerified,
    updatedAt: worker.updatedAt.toISOString(),
  };
}
