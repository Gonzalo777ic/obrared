import Link from "next/link";
import { MapPin, Wrench } from "lucide-react";

import { ContactWorkerButton } from "@/components/workers/contact-worker-button";
import { getWorkerProfileHref } from "@/lib/workers/profile-href";
import type { WorkerProfile } from "@/types/worker";

import { WorkerImageCarousel } from "./worker-image-carousel";

type WorkerCardProps = {
  worker: WorkerProfile;
  layout?: "horizontal" | "vertical";
  isAuthenticated?: boolean;
  senderName?: string | null;
};

export function WorkerCard({
  worker,
  layout = "horizontal",
  isAuthenticated = false,
  senderName = null,
}: WorkerCardProps) {
  const location = `${worker.districtName}, ${worker.cityName}`;
  const updatedLabel = new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
  }).format(new Date(worker.updatedAt));
  const profileHref = getWorkerProfileHref(worker);

  if (layout === "vertical") {
    return (
      <article className="flex h-full min-w-[260px] flex-col gap-3 border border-slate-200 bg-white p-4">
        <Link href={profileHref} className="block">
          <WorkerImageCarousel images={worker.images} workerName={worker.fullName} />
        </Link>
        <WorkerCardBody
          worker={worker}
          location={location}
          updatedLabel={updatedLabel}
          isAuthenticated={isAuthenticated}
          senderName={senderName}
          profileHref={profileHref}
        />
      </article>
    );
  }

  return (
    <article className="flex overflow-hidden border border-slate-200 bg-white">
      <Link href={profileHref} className="block shrink-0">
        <WorkerImageCarousel images={worker.images} workerName={worker.fullName} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <WorkerCardBody
          worker={worker}
          location={location}
          updatedLabel={updatedLabel}
          isAuthenticated={isAuthenticated}
          senderName={senderName}
          profileHref={profileHref}
        />
      </div>
    </article>
  );
}

type WorkerCardBodyProps = {
  worker: WorkerProfile;
  location: string;
  updatedLabel: string;
  isAuthenticated: boolean;
  senderName: string | null;
  profileHref: string;
};

function WorkerCardBody({
  worker,
  location,
  updatedLabel,
  isAuthenticated,
  senderName,
  profileHref,
}: WorkerCardBodyProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            <Link href={profileHref} className="hover:text-amber-700">
              {worker.fullName}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-slate-600">
            {worker.specialtyName} · {worker.levelName}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <MapPin
            className="h-3.5 w-3.5 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <span className="truncate">
            {location}
            <span className="text-slate-400"> · {worker.departmentName}</span>
          </span>
        </p>
        {worker.machinerySlug !== "ninguna" && (
          <p className="flex items-center gap-2">
            <Wrench
              className="h-3.5 w-3.5 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <span className="truncate">{worker.machineryName}</span>
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span
          className={`text-xs font-medium ${
            worker.availabilitySlug === "inmediata" ||
            worker.availabilitySlug === "libre"
              ? "text-emerald-700"
              : "text-slate-600"
          }`}
        >
          {worker.availabilityName}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={profileHref}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
          >
            Ver perfil
          </Link>
          <span className="text-[11px] text-slate-400">Act. {updatedLabel}</span>
          <ContactWorkerButton
            workerName={worker.fullName}
            whatsapp={worker.whatsapp}
            isAuthenticated={isAuthenticated}
            senderName={senderName}
          />
        </div>
      </div>
    </>
  );
}
