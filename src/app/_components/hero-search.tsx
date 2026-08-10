"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LocateFixed, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getDepartments, getDistricts, getProvinces } from "ubigeo-fns";

import { resolveDeviceDistrictAction } from "@/app/_actions/geolocation";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import {
  LOCATION_SEARCH_MODES,
  WORKER_SEARCH_FILTER_LABELS,
} from "@/constants/worker-search";
import { workerSearchSchema } from "@/schemas/worker-search.schema";
import type { HomeCatalog } from "@/types/catalog";

import type { WorkerSearchFilters } from "./worker-filters";

type HeroSearchValues = Omit<WorkerSearchFilters, "category">;

type HeroSearchProps = {
  catalog: HomeCatalog;
  initialFilters: WorkerSearchFilters;
  onSearch: (filters: Omit<WorkerSearchFilters, "category">) => void;
};

const allOption = { value: "", label: "Todas" };

export function HeroSearch({
  catalog,
  initialFilters,
  onSearch,
}: HeroSearchProps) {
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { control, handleSubmit, watch, setValue, getValues } = useForm<HeroSearchValues>({
    resolver: zodResolver(workerSearchSchema.omit({ category: true })),
    defaultValues: {
      specialty: initialFilters.specialty,
      machinery: initialFilters.machinery,
      availability: initialFilters.availability,
      departmentCode: initialFilters.departmentCode,
      cityCode: initialFilters.cityCode,
      districtCode: initialFilters.districtCode,
      locationMode: initialFilters.locationMode,
    },
  });

  const departmentCode = watch("departmentCode");
  const cityCode = watch("cityCode");
  const districtCode = watch("districtCode");
  const locationMode = watch("locationMode");

  const departmentOptions = useMemo(
    () => [
      allOption,
      ...getDepartments().map((item) => ({
        value: item.code,
        label: item.name,
      })),
    ],
    [],
  );

  const provinceOptions = useMemo(() => {
    if (!departmentCode) return [allOption];

    return [
      allOption,
      ...getProvinces(departmentCode).map((item) => ({
        value: item.code,
        label: item.name,
      })),
    ];
  }, [departmentCode]);

  const districtOptions = useMemo(() => {
    if (!cityCode) return [allOption];

    return [
      allOption,
      ...getDistricts(cityCode).map((item) => ({
        value: item.code,
        label: item.name,
      })),
    ];
  }, [cityCode]);

  const selectedDistrictLabel = useMemo(() => {
    if (!districtCode) return null;
    return districtOptions.find((item) => item.value === districtCode)?.label;
  }, [districtCode, districtOptions]);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setLocationMessage("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);
    setLocationMessage(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const result = await resolveDeviceDistrictAction({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      if ("error" in result && result.error) {
        setLocationMessage(result.error);
        return;
      }

      if (!result.district) {
        setLocationMessage(
          "No pudimos identificar tu distrito. Selecciónalo manualmente.",
        );
        return;
      }

      setValue("departmentCode", result.district.departmentCode, {
        shouldDirty: true,
      });
      setValue("cityCode", result.district.cityCode, { shouldDirty: true });
      setValue("districtCode", result.district.districtCode, {
        shouldDirty: true,
      });
      setValue("locationMode", LOCATION_SEARCH_MODES.device, {
        shouldDirty: true,
      });
      setLocationMessage(
        `Distrito detectado: ${result.district.districtName}, ${result.district.cityName}. Filtrando automáticamente.`,
      );
      onSearch({
        ...getValues(),
        departmentCode: result.district.departmentCode,
        cityCode: result.district.cityCode,
        districtCode: result.district.districtCode,
        locationMode: LOCATION_SEARCH_MODES.device,
      });
    } catch {
      setLocationMessage(
        "No se pudo acceder a tu ubicación. Activa el permiso o elige el distrito manualmente.",
      );
    } finally {
      setIsLocating(false);
    }
  };

  const markManualLocation = () => {
    setValue("locationMode", LOCATION_SEARCH_MODES.manual, { shouldDirty: true });
    setLocationMessage(null);
  };

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Buscador por ubicación
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Encuentra mano de obra cerca de tu obra
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Priorizamos tu distrito para mostrar anuncios lo más cercanos posible.
            También puedes afinar por especialidad, maquinaria y disponibilidad.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((values) => onSearch(values))}
          className="mt-6 space-y-5"
        >
          <div className="border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Ubicación principal
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {locationMode === LOCATION_SEARCH_MODES.device && selectedDistrictLabel
                    ? `Buscando en tu distrito: ${selectedDistrictLabel}`
                    : "Usa tu ubicación actual o elige departamento, provincia y distrito."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LocateFixed className="h-4 w-4" aria-hidden="true" />
                {isLocating ? "Detectando distrito..." : "Usar mi ubicación"}
              </button>
            </div>

            {locationMessage ? (
              <p className="mt-3 text-xs text-slate-600">{locationMessage}</p>
            ) : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Controller
                name="departmentCode"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    value={field.value}
                    onChange={(value) => {
                      markManualLocation();
                      field.onChange(value);
                      setValue("cityCode", "");
                      setValue("districtCode", "");
                    }}
                    options={departmentOptions}
                    placeholder={WORKER_SEARCH_FILTER_LABELS.department}
                    aria-label={WORKER_SEARCH_FILTER_LABELS.department}
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
                      markManualLocation();
                      field.onChange(value);
                      setValue("districtCode", "");
                    }}
                    options={provinceOptions}
                    placeholder={WORKER_SEARCH_FILTER_LABELS.province}
                    aria-label={WORKER_SEARCH_FILTER_LABELS.province}
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
                    onChange={(value) => {
                      markManualLocation();
                      field.onChange(value);
                    }}
                    options={districtOptions}
                    placeholder={WORKER_SEARCH_FILTER_LABELS.district}
                    aria-label={WORKER_SEARCH_FILTER_LABELS.district}
                    disabled={!cityCode}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Controller
              name="specialty"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={[allOption, ...catalog.specialties]}
                  placeholder={WORKER_SEARCH_FILTER_LABELS.specialty}
                  aria-label={WORKER_SEARCH_FILTER_LABELS.specialty}
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
                  options={[allOption, ...catalog.machineryTypes]}
                  placeholder={WORKER_SEARCH_FILTER_LABELS.machinery}
                  aria-label={WORKER_SEARCH_FILTER_LABELS.machinery}
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
                  options={[allOption, ...catalog.availabilityStatuses]}
                  placeholder={WORKER_SEARCH_FILTER_LABELS.availability}
                  aria-label={WORKER_SEARCH_FILTER_LABELS.availability}
                />
              )}
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar en mi zona
          </button>
        </form>
      </div>
    </section>
  );
}
