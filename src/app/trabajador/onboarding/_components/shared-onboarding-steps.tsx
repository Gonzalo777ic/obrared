"use client";

import type { Control, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { getDepartments, getDistricts, getProvinces } from "ubigeo-fns";

import { CloudinaryImageUploader } from "@/components/ui/cloudinary-image-uploader";
import { MultiSelectPills } from "@/components/ui/multi-select-pills";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import {
  WORKER_GALLERY_LIMITS,
  WORKER_GALLERY_RECOMMENDATION,
} from "@/constants/worker-onboarding";
import type { OnboardingFormValues } from "@/schemas/worker-onboarding.schema";
import type { HomeCatalog } from "@/types/catalog";

const emptyOption = { value: "", label: "Seleccionar" };

type SharedStepsProps = {
  control: Control<OnboardingFormValues>;
  setValue: UseFormSetValue<OnboardingFormValues>;
  getValues: UseFormGetValues<OnboardingFormValues>;
  catalog: HomeCatalog;
  departmentCode: string;
  cityCode: string;
  step: number;
  coverageHint: string;
  galleryLabel: string;
};

export function SharedOnboardingSteps({
  control,
  setValue,
  getValues,
  catalog,
  departmentCode,
  cityCode,
  step,
  coverageHint,
  galleryLabel,
}: SharedStepsProps) {
  const availabilityOptions = catalog.availabilityStatuses.filter((item) =>
    ["libre", "en-obra"].includes(item.value),
  );

  const provinceOptions = departmentCode
    ? [
        emptyOption,
        ...getProvinces(departmentCode).map((item) => ({
          value: item.code,
          label: item.name,
        })),
      ]
    : [emptyOption];

  const districtOptions = cityCode
    ? [
        emptyOption,
        ...getDistricts(cityCode).map((item) => ({
          value: item.code,
          label: item.name,
        })),
      ]
    : [emptyOption];

  const coverageOptions = cityCode
    ? getDistricts(cityCode).map((item) => ({
        value: item.code,
        label: item.name,
      }))
    : [];

  if (step === 2) {
    return (
      <>
        <Controller
          name="availabilitySlug"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value as "libre" | "en-obra")}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    field.value === option.value
                      ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-3">
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
                  setValue("coverageDistrictCodes", []);
                }}
                options={[
                  emptyOption,
                  ...getDepartments().map((item) => ({
                    value: item.code,
                    label: item.name,
                  })),
                ]}
                placeholder="Departamento base"
                aria-label="Departamento base"
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
                  setValue("coverageDistrictCodes", []);
                }}
                options={provinceOptions}
                placeholder="Provincia base"
                aria-label="Provincia base"
                disabled={!departmentCode}
              />
            )}
          />
          <Controller
            name="districtCode"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <SelectDropdown
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    const current = getValues("coverageDistrictCodes");
                    if (value && !current.includes(value)) {
                      setValue("coverageDistrictCodes", [...current, value]);
                    }
                  }}
                  options={districtOptions}
                  placeholder="Distrito base"
                  aria-label="Distrito base"
                  disabled={!cityCode}
                />
                {fieldState.error ? (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        </div>

        <Controller
          name="coverageDistrictCodes"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <MultiSelectPills
                label="Zonas de cobertura *"
                hint={coverageHint}
                options={coverageOptions}
                value={field.value}
                onChange={field.onChange}
              />
              {fieldState.error ? (
                <p className="mt-2 text-xs text-red-600">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </>
    );
  }

  if (step === 3) {
    return (
      <Controller
        name="galleryPhotoUrls"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <CloudinaryImageUploader
              folder="gallery"
              label={galleryLabel}
              hint={WORKER_GALLERY_RECOMMENDATION}
              value={field.value}
              onChange={field.onChange}
              maxFiles={WORKER_GALLERY_LIMITS.max}
            />
            {fieldState.error ? (
              <p className="mt-2 text-xs text-red-600">{fieldState.error.message}</p>
            ) : null}
          </div>
        )}
      />
    );
  }

  return null;
}
