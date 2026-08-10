import {
  mapWorkerProfile,
  workerProfileInclude,
} from "@/lib/mappers/worker-profile";
import { activeOnly, prisma } from "@/lib/prisma";
import type { PublicWorkerDetail, WorkerReview } from "@/types/worker";

const reviewInclude = {
  author: {
    select: {
      fullName: true,
      email: true,
    },
  },
  images: {
    where: { isDeleted: false },
    orderBy: { sortOrder: "asc" as const },
  },
};

function mapReview(review: {
  id: string;
  body: string;
  rating: number;
  createdAt: Date;
  author: { fullName: string | null; email: string };
  images: { id: string; url: string; sortOrder: number }[];
}): WorkerReview {
  return {
    id: review.id,
    body: review.body,
    rating: review.rating,
    createdAt: review.createdAt.toISOString(),
    authorName:
      review.author.fullName?.trim() || review.author.email.split("@")[0],
    images: review.images.map((image) => ({
      id: image.id,
      url: image.url,
      sortOrder: image.sortOrder,
    })),
  };
}

export async function getPublicWorkerById(
  id: string,
): Promise<PublicWorkerDetail | null> {
  const worker = await prisma.workerProfile.findFirst({
    where: {
      id,
      ...activeOnly,
    },
    include: {
      ...workerProfileInclude,
      reviews: {
        where: { isDeleted: false },
        include: reviewInclude,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!worker) return null;

  const reviews = worker.reviews.map(mapReview);
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
          ).toFixed(1),
        )
      : null;

  return {
    ...mapWorkerProfile(worker),
    presentation: worker.presentation,
    profilePhotoUrl: worker.profilePhotoUrl,
    yearsOfExperience: worker.yearsOfExperience,
    contactPersonName: worker.contactPersonName,
    contactPersonRole: worker.contactPersonRole,
    reviews,
    averageRating,
    reviewCount,
  };
}

export { getWorkerProfileHref } from "@/lib/workers/profile-href";
