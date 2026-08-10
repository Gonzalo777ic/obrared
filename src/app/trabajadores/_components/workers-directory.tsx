"use client";

import { useMemo, useState } from "react";

import {
  EMPTY_SEARCH_FILTERS,
  getRankedWorkers,
  hasActiveLocationFilter,
  type WorkerSearchFilters,
} from "@/app/_components/worker-filters";
import { WorkerCard } from "@/components/workers/worker-card";
import type { HomeCatalog } from "@/types/catalog";
import type { WorkerProfile } from "@/types/worker";

import { WorkersCoverageFilters } from "./workers-coverage-filters";

type WorkersDirectoryProps = {
  workers: WorkerProfile[];
  catalog: HomeCatalog;
  isAuthenticated: boolean;
  senderName?: string | null;
};

export function WorkersDirectory({
  workers,
  catalog,
  isAuthenticated,
  senderName = null,
}: WorkersDirectoryProps) {
  const [filters, setFilters] =
    useState<WorkerSearchFilters>(EMPTY_SEARCH_FILTERS);

  const rankedWorkers = useMemo(
    () => getRankedWorkers(workers, filters, catalog.categories),
    [catalog.categories, filters, workers],
  );

  const locationActive = hasActiveLocationFilter(filters);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Directorio de trabajadores
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Profesionales publicados en ObraRed
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Filtra por zonas de cobertura para ver quién puede trabajar en tu
          distrito. También puedes afinar por oficio, maquinaria y
          disponibilidad.
        </p>
      </div>

      <div className="mt-6">
        <WorkersCoverageFilters
          catalog={catalog}
          initialFilters={filters}
          onSearch={(nextFilters) =>
            setFilters((prev) => ({ ...prev, ...nextFilters }))
          }
        />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {locationActive
                ? "Profesionales con cobertura en tu zona"
                : "Todos los profesionales"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {rankedWorkers.length} resultado
              {rankedWorkers.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {rankedWorkers.length === 0 ? (
          <div className="mt-5 border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-900">
              No hay trabajadores con esos filtros
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Prueba otro distrito de cobertura o limpia especialidad y
              disponibilidad.
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {rankedWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                layout="horizontal"
                isAuthenticated={isAuthenticated}
                senderName={senderName}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
