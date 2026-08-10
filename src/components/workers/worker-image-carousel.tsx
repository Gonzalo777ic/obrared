"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { WorkerImage } from "@/types/worker";

type WorkerImageCarouselProps = {
  images: WorkerImage[];
  workerName: string;
};

const FALLBACK_IMAGE =
  "https://picsum.photos/seed/obrared-worker/640/480";

export function WorkerImageCarousel({
  images,
  workerName,
}: WorkerImageCarouselProps) {
  const gallery =
    images.length > 0
      ? images
      : [
          {
            id: "fallback",
            url: FALLBACK_IMAGE,
            altText: workerName,
            description: null,
            sortOrder: 0,
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex];
  const hasMultiple = gallery.length > 1;

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? gallery.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === gallery.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="relative h-full min-h-[132px] w-[132px] shrink-0 overflow-hidden bg-slate-100 sm:min-h-[148px] sm:w-[180px]">
      <Image
        src={activeImage.url}
        alt={activeImage.altText ?? workerName}
        fill
        sizes="180px"
        className="object-cover"
      />

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center bg-slate-900/75 text-white transition-colors hover:bg-slate-900"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center bg-slate-900/75 text-white transition-colors hover:bg-slate-900"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
            {gallery.map((image, index) => (
              <span
                key={image.id}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === activeIndex ? "bg-amber-500" : "bg-white/70"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
