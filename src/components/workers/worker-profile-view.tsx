import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { ContactWorkerButton } from "@/components/workers/contact-worker-button";
import { PortfolioSection } from "@/components/workers/portfolio-section";
import { ReviewsSection } from "@/components/workers/reviews-section";
import { PUBLISHER_TYPES } from "@/constants/publisher-type";
import { getWorkerProfileHref } from "@/lib/workers/profile-href";
import type { PublicWorkerDetail } from "@/types/worker";

type WorkerProfileViewProps = {
  worker: PublicWorkerDetail;
  isAuthenticated: boolean;
  isOwner: boolean;
  canReview: boolean;
  senderName: string | null;
  backHref: string;
  backLabel: string;
};

export function WorkerProfileView({
  worker,
  isAuthenticated,
  isOwner,
  canReview,
  senderName,
  backHref,
  backLabel,
}: WorkerProfileViewProps) {
  const isCompany = worker.publisherType === PUBLISHER_TYPES.company.value;
  const location = `${worker.districtName}, ${worker.cityName}`;
  const profileHref = getWorkerProfileHref(worker);

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:py-10">
      <Link
        href={backHref}
        className="inline-flex text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← {backLabel}
      </Link>

      <div className="border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-slate-200 bg-slate-100">
            {worker.profilePhotoUrl ? (
              <Image
                src={worker.profilePhotoUrl}
                alt={worker.fullName}
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                Sin foto
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              {isCompany ? "Empresa" : "Profesional"}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
              {worker.fullName}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {worker.specialtyName} · {worker.levelName}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                {location}
              </span>
              {worker.reviewCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-amber-700">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  {worker.averageRating?.toFixed(1)} ({worker.reviewCount})
                </span>
              ) : null}
              <span
                className={
                  worker.availabilitySlug === "libre"
                    ? "font-medium text-emerald-700"
                    : "text-slate-600"
                }
              >
                {worker.availabilityName}
              </span>
            </div>

            {worker.presentation ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                {worker.presentation}
              </p>
            ) : null}

            {isCompany && worker.contactPersonName ? (
              <p className="mt-3 text-sm text-slate-600">
                Contacto: {worker.contactPersonName}
                {worker.contactPersonRole
                  ? ` · ${worker.contactPersonRole}`
                  : ""}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-600">
                {isCompany ? "Años de operación" : "Experiencia"}:{" "}
                <span className="font-semibold text-slate-900">
                  {worker.yearsOfExperience}
                </span>
              </p>
              <ContactWorkerButton
                workerName={worker.fullName}
                whatsapp={worker.whatsapp}
                isAuthenticated={isAuthenticated}
                senderName={senderName}
              />
            </div>
          </div>
        </div>

        {worker.coverageDistricts.length > 0 ? (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Zonas de cobertura
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {worker.coverageDistricts
                .map((item) => `${item.districtName}, ${item.cityName}`)
                .join(" · ")}
            </p>
          </div>
        ) : null}
      </div>

      <PortfolioSection
        workerProfileId={worker.id}
        images={worker.images}
        isOwner={isOwner}
      />

      <ReviewsSection
        workerProfileId={worker.id}
        profileHref={profileHref}
        reviews={worker.reviews}
        averageRating={worker.averageRating}
        reviewCount={worker.reviewCount}
        isAuthenticated={isAuthenticated}
        isOwner={isOwner}
        canReview={canReview}
      />
    </section>
  );
}
