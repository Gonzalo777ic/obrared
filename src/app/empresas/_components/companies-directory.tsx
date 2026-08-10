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

import { CompaniesCoverageFilters } from "./companies-coverage-filters";

type CompaniesDirectoryProps = {
  workers: WorkerProfile[];
  catalog: HomeCatalog;
  isAuthenticated: boolean;
  senderName?: string | null;
};

export function CompaniesDirectory({
  workers,
  catalog,
  isAuthenticated,
  senderName = null,
}: CompaniesDirectoryProps) {
  const [filters, setFilters] =
    useState<WorkerSearchFilters>(EMPTY_SEARCH_FILTERS);

  const rankedCompanies = useMemo(
    () => getRankedWorkers(workers, filters, catalog.categories),
    [catalog.categories, filters, workers],
  );

  const locationActive = hasActiveLocationFilter(filters);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Directorio de empresas
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Empresas y contratistas en ObraRed
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Filtra por zonas de cobertura para encontrar empresas que puedan
          ejecutar obras en tu distrito. También puedes afinar por línea de
          servicio, capacidad instalada y disponibilidad.
        </p>
      </div>

      <div className="mt-6">
        <CompaniesCoverageFilters
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
                ? "Empresas con cobertura en tu zona"
                : "Todas las empresas"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {rankedCompanies.length} resultado
              {rankedCompanies.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {rankedCompanies.length === 0 ? (
          <div className="mt-5 border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-900">
              No hay empresas con esos filtros
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Prueba otro distrito de cobertura o limpia línea de servicio y
              disponibilidad.
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {rankedCompanies.map((company) => (
              <WorkerCard
                key={company.id}
                worker={company}
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
