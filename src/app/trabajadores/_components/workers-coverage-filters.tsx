"use client";

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
import type { HomeCatalog } from "@/types/catalog";

import type { WorkerSearchFilters } from "@/app/_components/worker-filters";

type CoverageFilterValues = Pick<
  WorkerSearchFilters,
  | "specialty"
  | "machinery"
  | "availability"
  | "departmentCode"
  | "cityCode"
  | "districtCode"
  | "locationMode"
>;

type WorkersCoverageFiltersProps = {
  catalog: HomeCatalog;
  initialFilters: WorkerSearchFilters;
  onSearch: (filters: CoverageFilterValues) => void;
};

const allOption = { value: "", label: "Todas" };

export function WorkersCoverageFilters({
  catalog,
  initialFilters,
  onSearch,
}: WorkersCoverageFiltersProps) {
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { control, handleSubmit, watch, setValue, getValues } =
    useForm<CoverageFilterValues>({
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

  const markManualLocation = () => {
    setValue("locationMode", LOCATION_SEARCH_MODES.manual);
    setLocationMessage(null);
  };

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

  return (
    <form
      onSubmit={handleSubmit((values) => onSearch(values))}
      className="space-y-5 border border-slate-200 bg-white p-5"
    >
      <div className="border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Zona de cobertura
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {locationMode === LOCATION_SEARCH_MODES.device &&
              selectedDistrictLabel
                ? `Mostrando profesionales que cubren ${selectedDistrictLabel}`
                : "Filtra por los distritos donde el profesional acepta trabajar."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleUseMyLocation()}
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
        Filtrar trabajadores
      </button>
    </form>
  );
}
