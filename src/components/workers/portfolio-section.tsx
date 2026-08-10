"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  addPortfolioItemsAction,
  softDeletePortfolioImageAction,
} from "@/app/_actions/worker-reviews";
import { CloudinaryImageUploader } from "@/components/ui/cloudinary-image-uploader";
import {
  WORKER_PORTFOLIO_LIMITS,
  WORKER_PROFILE_COPY,
} from "@/constants/worker-reviews";
import type { WorkerImage } from "@/types/worker";

type PortfolioSectionProps = {
  workerProfileId: string;
  images: WorkerImage[];
  isOwner: boolean;
};

export function PortfolioSection({
  workerProfileId,
  images,
  isOwner,
}: PortfolioSectionProps) {
  const router = useRouter();
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const remaining = WORKER_PORTFOLIO_LIMITS.maxPhotos - images.length;

  const handleAdd = async () => {
    if (photoUrls.length === 0) {
      setError("Sube al menos una foto.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await addPortfolioItemsAction({
      workerProfileId,
      items: photoUrls.map((url) => ({
        url,
        description,
      })),
    });

    setIsSubmitting(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    setPhotoUrls([]);
    setDescription("");
    router.refresh();
  };

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    const result = await softDeletePortfolioImageAction(imageId);
    setDeletingId(null);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  };

  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">
        {WORKER_PROFILE_COPY.portfolioTitle}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Fotos de obras con una breve descripción del trabajo.
      </p>

      {images.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          {WORKER_PROFILE_COPY.portfolioEmpty}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <article
              key={image.id}
              className="overflow-hidden border border-slate-200 bg-slate-50"
            >
              <div className="relative aspect-[4/3] bg-slate-200">
                <Image
                  src={image.url}
                  alt={image.altText || image.description || "Trabajo realizado"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="text-sm text-slate-700">
                  {image.description?.trim() || "Sin descripción"}
                </p>
                {isOwner ? (
                  <button
                    type="button"
                    disabled={deletingId === image.id}
                    onClick={() => void handleDelete(image.id)}
                    className="text-xs font-semibold text-red-700 hover:text-red-800 disabled:opacity-50"
                  >
                    {deletingId === image.id ? "Quitando..." : "Quitar foto"}
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {isOwner && remaining > 0 ? (
        <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
          <p className="text-sm font-semibold text-slate-900">
            Agregar trabajos ({remaining} disponibles)
          </p>
          <CloudinaryImageUploader
            folder="gallery"
            label="Fotos del trabajo"
            hint="Puedes subir varias y usar la misma descripción breve."
            value={photoUrls}
            onChange={setPhotoUrls}
            maxFiles={Math.min(remaining, 4)}
          />
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Descripción breve
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              maxLength={WORKER_PORTFOLIO_LIMITS.maxDescriptionLength}
              placeholder="Ej. Remodelación de cocina en Surco, acabados en ceramico."
              className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="button"
            disabled={isSubmitting || photoUrls.length === 0}
            onClick={() => void handleAdd()}
            className="inline-flex items-center justify-center bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Publicar en portafolio"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
