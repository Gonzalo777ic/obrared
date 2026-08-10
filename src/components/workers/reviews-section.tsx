"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { submitWorkerReviewAction } from "@/app/_actions/worker-reviews";
import { CloudinaryImageUploader } from "@/components/ui/cloudinary-image-uploader";
import {
  WORKER_PROFILE_COPY,
  WORKER_REVIEW_LIMITS,
} from "@/constants/worker-reviews";
import type { WorkerReview } from "@/types/worker";

type ReviewsSectionProps = {
  workerProfileId: string;
  profileHref: string;
  reviews: WorkerReview[];
  averageRating: number | null;
  reviewCount: number;
  isAuthenticated: boolean;
  isOwner: boolean;
  canReview: boolean;
};

export function ReviewsSection({
  workerProfileId,
  profileHref,
  reviews,
  averageRating,
  reviewCount,
  isAuthenticated,
  isOwner,
  canReview,
}: ReviewsSectionProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const result = await submitWorkerReviewAction({
      workerProfileId,
      body,
      rating,
      photoUrls,
    });

    setIsSubmitting(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    setBody("");
    setRating(5);
    setPhotoUrls([]);
    router.refresh();
  };

  return (
    <section className="border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {WORKER_PROFILE_COPY.reviewsTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {reviewCount > 0
              ? `${averageRating?.toFixed(1)} / 5 · ${reviewCount} reseña${reviewCount === 1 ? "" : "s"}`
              : WORKER_PROFILE_COPY.reviewsEmpty}
          </p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="mt-5 space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {review.authorName}
                </p>
                <p className="text-xs font-medium text-amber-700">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {review.body}
              </p>
              {review.images.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {review.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-20 w-20 overflow-hidden border border-slate-200 bg-white"
                    >
                      <Image
                        src={image.url}
                        alt={`Foto de reseña de ${review.authorName}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="mt-2 text-[11px] text-slate-400">
                {new Intl.DateTimeFormat("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(review.createdAt))}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      <div className="mt-6 border-t border-slate-200 pt-5">
        {!isAuthenticated ? (
          <p className="text-sm text-slate-600">
            {WORKER_PROFILE_COPY.reviewLoginRequired}{" "}
            <Link
              href={`/auth?next=${encodeURIComponent(profileHref)}`}
              className="font-semibold text-red-700 hover:text-red-800"
            >
              Iniciar sesión
            </Link>
          </p>
        ) : isOwner ? (
          <p className="text-sm text-slate-500">
            {WORKER_PROFILE_COPY.reviewOwnProfileBlocked}
          </p>
        ) : !canReview ? (
          <p className="text-sm text-slate-500">
            {WORKER_PROFILE_COPY.reviewAlreadyExists}
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              Deja tu opinión
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: WORKER_REVIEW_LIMITS.maxRating }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`border px-3 py-1.5 text-sm font-semibold ${
                      rating === value
                        ? "border-amber-500 bg-amber-50 text-amber-800"
                        : "border-slate-300 bg-white text-slate-600"
                    }`}
                  >
                    {value} ★
                  </button>
                );
              })}
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Comentario breve *
              </span>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={3}
                maxLength={WORKER_REVIEW_LIMITS.maxBodyLength}
                placeholder="Cuéntanos cómo fue el trabajo, puntualidad, calidad, limpieza..."
                className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
              />
            </label>
            <CloudinaryImageUploader
              folder="review"
              label="Fotos opcionales"
              hint={`Hasta ${WORKER_REVIEW_LIMITS.maxPhotos} fotos del trabajo o resultado.`}
              value={photoUrls}
              onChange={setPhotoUrls}
              maxFiles={WORKER_REVIEW_LIMITS.maxPhotos}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void handleSubmit()}
              className="inline-flex items-center justify-center bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isSubmitting ? "Publicando..." : "Publicar reseña"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
