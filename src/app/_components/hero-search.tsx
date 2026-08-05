"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { getDepartments, getDistricts, getProvinces } from "ubigeo-fns";

import { SelectDropdown } from "@/components/ui/select-dropdown";
import { workerSearchSchema } from "@/schemas/worker-search.schema";
import type { HomeCatalog } from "@/types/catalog";

import type { WorkerSearchFilters } from "./worker-filters";

type HeroSearchValues = {
  specialty: string;
  machinery: string;
  availability: string;
  departmentCode: string;
  cityCode: string;
  districtCode: string;
};

type HeroSearchProps = {
  catalog: HomeCatalog;
  initialFilters: WorkerSearchFilters;
  onSearch: (filters: Omit<WorkerSearchFilters, "category">) => void;
};

const emptyOption = { value: "", label: "Todos" };

export function HeroSearch({
  catalog,
  initialFilters,
  onSearch,
}: HeroSearchProps) {
  const { control, handleSubmit, watch, setValue } = useForm<HeroSearchValues>({
    resolver: zodResolver(workerSearchSchema.omit({ category: true })),
    defaultValues: {
      specialty: initialFilters.specialty,
      machinery: initialFilters.machinery,
      availability: initialFilters.availability,
      departmentCode: initialFilters.departmentCode,
      cityCode: initialFilters.cityCode,
      districtCode: initialFilters.districtCode,
    },
  });

  const departmentCode = watch("departmentCode");
  const cityCode = watch("cityCode");

  const departmentOptions = useMemo(
    () => [
      emptyOption,
      ...getDepartments().map((item) => ({
        value: item.code,
        label: item.name,
      })),
    ],
    [],
  );

  const cityOptions = useMemo(() => {
    if (!departmentCode) return [emptyOption];

    return [
      emptyOption,
      ...getProvinces(departmentCode).map((item) => ({
        value: item.code,
        label: item.name,
      })),
    ];
  }, [departmentCode]);

  const districtOptions = useMemo(() => {
    if (!cityCode) return [emptyOption];

    return [
      emptyOption,
      ...getDistricts(cityCode).map((item) => ({
        value: item.code,
        label: item.name,
      })),
    ];
  }, [cityCode]);

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Buscador central
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Encuentra mano de obra técnica lista para obra
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Filtra por especialidad, maquinaria, disponibilidad y ubicación en
            Perú.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((values) => onSearch(values))}
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Controller
            name="specialty"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={[emptyOption, ...catalog.specialties]}
                placeholder="Especialidad"
                aria-label="Especialidad"
              />
            )}
          />

          <Controller
            name="machinery"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={[emptyOption, ...catalog.machineryTypes]}
                placeholder="Tipo de maquinaria"
                aria-label="Tipo de maquinaria"
              />
            )}
          />

          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={[emptyOption, ...catalog.availabilityStatuses]}
                placeholder="Disponibilidad"
                aria-label="Disponibilidad"
              />
            )}
          />

          <Controller
            name="departmentCode"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("cityCode", "");
                  setValue("districtCode", "");
                }}
                options={departmentOptions}
                placeholder="Departamento"
                aria-label="Departamento"
              />
            )}
          />

          <Controller
            name="cityCode"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("districtCode", "");
                }}
                options={cityOptions}
                placeholder="Ciudad"
                aria-label="Ciudad"
                disabled={!departmentCode}
              />
            )}
          />

          <Controller
            name="districtCode"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={districtOptions}
                placeholder="Distrito"
                aria-label="Distrito"
                disabled={!cityCode}
              />
            )}
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Buscar trabajadores
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
