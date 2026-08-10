"use server";

import { revalidatePath } from "next/cache";

import {
  WORKER_PORTFOLIO_LIMITS,
  WORKER_PROFILE_COPY,
} from "@/constants/worker-reviews";
import { getAuthUser, getCurrentUserProfile } from "@/lib/auth/session";
import { getWorkerProfileHref } from "@/lib/workers/profile-href";
import { activeOnly, prisma } from "@/lib/prisma";
import {
  addPortfolioItemsSchema,
  workerReviewSchema,
} from "@/schemas/worker-review.schema";

function revalidateWorkerProfile(worker: {
  id: string;
  publisherType: string;
}) {
  const href = getWorkerProfileHref(worker);
  revalidatePath(href);
  revalidatePath("/trabajadores");
  revalidatePath("/empresas");
  revalidatePath("/panel/anuncios");
  revalidatePath("/", "layout");
}

export async function submitWorkerReviewAction(input: unknown) {
  const user = await getAuthUser();
  if (!user) {
    return { error: WORKER_PROFILE_COPY.reviewLoginRequired };
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { error: "Perfil de usuario no encontrado." };
  }

  const parsed = workerReviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const data = parsed.data;

  const worker = await prisma.workerProfile.findFirst({
    where: {
      id: data.workerProfileId,
      ...activeOnly,
    },
    select: {
      id: true,
      publisherType: true,
      userProfileId: true,
    },
  });

  if (!worker) {
    return { error: "Perfil no encontrado." };
  }

  if (worker.userProfileId === profile.id) {
    return { error: WORKER_PROFILE_COPY.reviewOwnProfileBlocked };
  }

  const existing = await prisma.workerReview.findFirst({
    where: {
      workerProfileId: worker.id,
      authorUserProfileId: profile.id,
      isDeleted: false,
    },
  });

  if (existing) {
    return { error: WORKER_PROFILE_COPY.reviewAlreadyExists };
  }

  try {
    await prisma.workerReview.create({
      data: {
        workerProfileId: worker.id,
        authorUserProfileId: profile.id,
        body: data.body,
        rating: data.rating,
        images: {
          create: data.photoUrls.map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
      },
    });

    revalidateWorkerProfile(worker);
    return { success: true };
  } catch {
    return { error: "No se pudo publicar tu opinión. Intenta nuevamente." };
  }
}

export async function addPortfolioItemsAction(input: unknown) {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Debes iniciar sesión." };
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { error: "Perfil de usuario no encontrado." };
  }

  const parsed = addPortfolioItemsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const data = parsed.data;

  const worker = await prisma.workerProfile.findFirst({
    where: {
      id: data.workerProfileId,
      userProfileId: profile.id,
      ...activeOnly,
    },
    select: {
      id: true,
      publisherType: true,
      _count: {
        select: {
          images: {
            where: { isDeleted: false },
          },
        },
      },
    },
  });

  if (!worker) {
    return { error: "Solo el dueño del perfil puede agregar fotos." };
  }

  const remaining =
    WORKER_PORTFOLIO_LIMITS.maxPhotos - worker._count.images;

  if (remaining <= 0) {
    return {
      error: `Ya alcanzaste el máximo de ${WORKER_PORTFOLIO_LIMITS.maxPhotos} fotos.`,
    };
  }

  if (data.items.length > remaining) {
    return {
      error: `Solo puedes agregar ${remaining} foto${remaining === 1 ? "" : "s"} más.`,
    };
  }

  try {
    await prisma.workerImage.createMany({
      data: data.items.map((item, index) => ({
        workerProfileId: worker.id,
        url: item.url,
        description: item.description?.trim() || null,
        altText: item.description?.trim() || `Trabajo ${index + 1}`,
        sortOrder: worker._count.images + index,
      })),
    });

    revalidateWorkerProfile(worker);
    return { success: true };
  } catch {
    return { error: "No se pudieron guardar las fotos del portafolio." };
  }
}

export async function softDeletePortfolioImageAction(imageId: string) {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Debes iniciar sesión." };
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { error: "Perfil de usuario no encontrado." };
  }

  const image = await prisma.workerImage.findFirst({
    where: {
      id: imageId,
      isDeleted: false,
      workerProfile: {
        userProfileId: profile.id,
        isDeleted: false,
      },
    },
    include: {
      workerProfile: {
        select: { id: true, publisherType: true },
      },
    },
  });

  if (!image) {
    return { error: "Foto no encontrada." };
  }

  await prisma.workerImage.update({
    where: { id: image.id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  revalidateWorkerProfile(image.workerProfile);
  return { success: true };
}
