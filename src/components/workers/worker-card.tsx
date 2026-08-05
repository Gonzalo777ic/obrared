import { BadgeCheck, MapPin, Wrench } from "lucide-react";

import type { WorkerProfile } from "@/types/worker";

type WorkerCardProps = {
  worker: WorkerProfile;
};

export function WorkerCard({ worker }: WorkerCardProps) {
  const location = `${worker.districtName}, ${worker.cityName}`;
  const updatedLabel = new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
  }).format(new Date(worker.updatedAt));

  return (
    <article className="flex h-full min-w-[260px] flex-col gap-3 border-b border-slate-200 bg-white p-4 sm:min-w-0 sm:rounded-none sm:border sm:border-slate-200">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {worker.fullName}
          </h3>
          <p className="mt-0.5 text-sm text-slate-600">
            {worker.specialtyName} · {worker.levelName}
          </p>
        </div>

        {(worker.isFeatured || worker.isVerified) && (
          <span className="inline-flex shrink-0 items-center gap-1 bg-amber-500 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-900">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {worker.isFeatured ? "Destacado" : "Verificado"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="truncate">
            {location}
            <span className="text-slate-400"> · {worker.departmentName}</span>
          </span>
        </p>
        {worker.machinerySlug !== "ninguna" && (
          <p className="flex items-center gap-2">
            <Wrench className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
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
        <span className="text-[11px] text-slate-400">Act. {updatedLabel}</span>
      </div>
    </article>
  );
}
