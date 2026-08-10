"use server";

import { revalidatePath } from "next/cache";

import { ROLE_SLUGS } from "@/constants/roles";
import { COMPANY_DOCUMENT_TYPE, PUBLISHER_TYPES } from "@/constants/publisher-type";
import { WORKER_PROFILE_RULES } from "@/constants/worker-profile";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import {
  uploadOptimizedImage,
  uploadRemoteImage,
  type CloudinaryUploadFolder,
} from "@/lib/cloudinary/upload";
import { prisma } from "@/lib/prisma";
import { getRoleBySlug } from "@/lib/queries/roles";
import { workerOnboardingSchema } from "@/schemas/worker-onboarding.schema";
import { getDepartment, getDistrict, getProvince } from "ubigeo-fns";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("51") && digits.length === 11) {
    return `+${digits}`;
  }
  if (digits.length === 9) {
    return `+51${digits}`;
  }
  return value;
}

function resolveUbigeoLabels(
  departmentCode: string,
  cityCode: string,
  districtCode: string,
) {
  const departmentName = getDepartment(departmentCode) ?? departmentCode;
  const cityName = getProvince(cityCode) ?? cityCode;
  const districtName = getDistrict(districtCode) ?? districtCode;

  return { departmentName, cityName, districtName };
}

function buildCoverageRows(districtCodes: string[]) {
  return districtCodes.map((districtCode) => {
    const departmentCode = districtCode.slice(0, 2);
    const cityCode = districtCode.slice(0, 4);
    const labels = resolveUbigeoLabels(departmentCode, cityCode, districtCode);

    return {
      departmentCode,
      departmentName: labels.departmentName,
      cityCode,
      cityName: labels.cityName,
      districtCode,
      districtName: labels.districtName,
    };
  });
}

export async function importRemoteProfilePhotoAction(url: string) {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Debes iniciar sesión." };
  }

  try {
    const uploaded = await uploadRemoteImage(url, "profile");
    return { url: uploaded.url, publicId: uploaded.publicId };
  } catch {
    return { error: "No se pudo importar la foto. Sube una imagen manualmente." };
  }
}

export async function uploadWorkerPhotoAction(formData: FormData) {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Debes iniciar sesión para subir imágenes." };
  }

  const folder = formData.get("folder");
  if (folder !== "profile" && folder !== "gallery" && folder !== "review") {
    return { error: "Destino de imagen inválido." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No se recibió ninguna imagen." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Solo se permiten imágenes." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "La imagen supera el límite de 8 MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadOptimizedImage(
      buffer,
      file.type,
      folder as CloudinaryUploadFolder,
    );

    return {
      url: uploaded.url,
      publicId: uploaded.publicId,
    };
  } catch {
    return { error: "No se pudo subir la imagen. Intenta nuevamente." };
  }
}

export async function submitWorkerOnboardingAction(input: unknown) {
  const user = await getAuthUser();
  if (!user?.email) {
    return { error: "Debes iniciar sesión." };
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { error: "Perfil de usuario no encontrado." };
  }

  if (profile.workerProfile) {
    return { error: WORKER_PROFILE_RULES.duplicateProfileMessage };
  }

  const parsed = workerOnboardingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const data = parsed.data;
  const baseLocation = resolveUbigeoLabels(
    data.departmentCode,
    data.cityCode,
    data.districtCode,
  );
  const coverageRows = buildCoverageRows(data.coverageDistrictCodes);

  const availability = await prisma.availabilityStatus.findFirst({
    where: { slug: data.availabilitySlug, isDeleted: false, isActive: true },
  });

  if (!availability) {
    return { error: "Catálogo incompleto. Contacta soporte." };
  }

  const targetRoleSlug =
    data.publisherType === PUBLISHER_TYPES.company.value
      ? ROLE_SLUGS.EMPRESA
      : ROLE_SLUGS.ANUNCIANTE;

  const targetRole = await getRoleBySlug(targetRoleSlug);
  if (!targetRole) {
    return { error: "Roles no configurados. Ejecuta pnpm db:seed." };
  }

  try {
    if (data.publisherType === PUBLISHER_TYPES.individual.value) {
      const [specialties, machinery, level] = await Promise.all([
        prisma.specialty.findMany({
          where: {
            slug: { in: data.specialtySlugs },
            isDeleted: false,
            isActive: true,
          },
        }),
        data.machinerySlugs.length
          ? prisma.machineryType.findMany({
              where: {
                slug: { in: data.machinerySlugs },
                isDeleted: false,
                isActive: true,
              },
            })
          : Promise.resolve([]),
        prisma.workerLevel.findFirst({
          where: { slug: data.levelSlug, isDeleted: false, isActive: true },
        }),
      ]);

      if (
        specialties.length !== data.specialtySlugs.length ||
        !level
      ) {
        return { error: "Catálogo incompleto. Contacta soporte." };
      }

      await prisma.$transaction(async (tx) => {
        const existingProfiles = await tx.workerProfile.count({
          where: { userProfileId: profile.id, isDeleted: false },
        });

        if (existingProfiles >= WORKER_PROFILE_RULES.maxPublicProfilesPerUser) {
          throw new Error(WORKER_PROFILE_RULES.duplicateProfileMessage);
        }

        await tx.workerProfile.create({
          data: {
            userProfileId: profile.id,
            publisherType: data.publisherType,
            fullName: profile.fullName ?? user.email.split("@")[0] ?? "Profesional",
            whatsapp: normalizeWhatsapp(data.whatsapp),
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            profilePhotoUrl: data.profilePhotoUrl,
            presentation: data.presentation,
            yearsOfExperience: data.yearsOfExperience,
            levelId: level.id,
            availabilityId: availability.id,
            departmentCode: data.departmentCode,
            departmentName: baseLocation.departmentName,
            cityCode: data.cityCode,
            cityName: baseLocation.cityName,
            districtCode: data.districtCode,
            districtName: baseLocation.districtName,
            specialties: {
              create: specialties.map((item) => ({ specialtyId: item.id })),
            },
            machinery: {
              create: machinery.map((item) => ({ machineryId: item.id })),
            },
            coverageDistricts: { create: coverageRows },
            images: {
              create: data.galleryPhotoUrls.map((url, index) => ({
                url,
                sortOrder: index,
                altText: `Trabajo ${index + 1}`,
              })),
            },
          },
        });

        await tx.userProfile.update({
          where: { id: profile.id },
          data: { roleId: targetRole.id },
        });
      });
    } else {
      const [categories, capacity] = await Promise.all([
        prisma.workCategory.findMany({
          where: {
            slug: { in: data.categorySlugs },
            isDeleted: false,
            isActive: true,
          },
          include: {
            specialties: {
              include: { specialty: true },
            },
          },
        }),
        data.capacitySlugs.length
          ? prisma.machineryType.findMany({
              where: {
                slug: { in: data.capacitySlugs },
                isDeleted: false,
                isActive: true,
              },
            })
          : Promise.resolve([]),
      ]);

      if (categories.length !== data.categorySlugs.length) {
        return { error: "Catálogo incompleto. Contacta soporte." };
      }

      const specialtyIds = [
        ...new Set(
          categories.flatMap((category) =>
            category.specialties.map((item) => item.specialtyId),
          ),
        ),
      ];

      await prisma.$transaction(async (tx) => {
        const existingProfiles = await tx.workerProfile.count({
          where: { userProfileId: profile.id, isDeleted: false },
        });

        if (existingProfiles >= WORKER_PROFILE_RULES.maxPublicProfilesPerUser) {
          throw new Error(WORKER_PROFILE_RULES.duplicateProfileMessage);
        }

        await tx.workerProfile.create({
          data: {
            userProfileId: profile.id,
            publisherType: data.publisherType,
            fullName: data.businessName,
            businessName: data.businessName,
            contactPersonName: data.contactPersonName,
            contactPersonRole: data.contactPersonRole,
            whatsapp: normalizeWhatsapp(data.whatsapp),
            documentType: COMPANY_DOCUMENT_TYPE,
            documentNumber: data.ruc,
            profilePhotoUrl: data.profilePhotoUrl,
            presentation: data.presentation,
            yearsOfExperience: data.yearsOfExperience,
            availabilityId: availability.id,
            departmentCode: data.departmentCode,
            departmentName: baseLocation.departmentName,
            cityCode: data.cityCode,
            cityName: baseLocation.cityName,
            districtCode: data.districtCode,
            districtName: baseLocation.districtName,
            specialties: {
              create: specialtyIds.map((specialtyId) => ({ specialtyId })),
            },
            categories: {
              create: categories.map((category) => ({
                categoryId: category.id,
              })),
            },
            machinery: {
              create: capacity.map((item) => ({ machineryId: item.id })),
            },
            coverageDistricts: { create: coverageRows },
            images: {
              create: data.galleryPhotoUrls.map((url, index) => ({
                url,
                sortOrder: index,
                altText: `Proyecto ${index + 1}`,
              })),
            },
          },
        });

        await tx.userProfile.update({
          where: { id: profile.id },
          data: { roleId: targetRole.id },
        });
      });
    }

    revalidatePath("/", "layout");
    revalidatePath("/panel/anuncios");

    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === WORKER_PROFILE_RULES.duplicateProfileMessage
    ) {
      return { error: error.message };
    }

    return { error: "No se pudo guardar tu perfil profesional." };
  }
}
