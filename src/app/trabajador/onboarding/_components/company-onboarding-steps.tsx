"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import { CloudinaryImageUploader } from "@/components/ui/cloudinary-image-uploader";
import { MultiSelectPills } from "@/components/ui/multi-select-pills";
import { COMPANY_CAPACITY_SLUGS } from "@/constants/publisher-type";
import type { OnboardingFormValues } from "@/schemas/worker-onboarding.schema";
import type { HomeCatalog } from "@/types/catalog";

type CompanyStepsProps = {
  control: Control<OnboardingFormValues>;
  catalog: HomeCatalog;
  step: number;
};

export function CompanyOnboardingSteps({
  control,
  catalog,
  step,
}: CompanyStepsProps) {
  const capacityOptions = catalog.machineryTypes.filter((item) =>
    COMPANY_CAPACITY_SLUGS.includes(
      item.value as (typeof COMPANY_CAPACITY_SLUGS)[number],
    ),
  );

  if (step === 0) {
    return (
      <>
        <Controller
          name="businessName"
          control={control}
          render={({ field, fieldState }) => (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Razón social o nombre comercial *
              </span>
              <input
                {...field}
                placeholder="Constructora Los Andes S.A.C."
                className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
              />
              {fieldState.error ? (
                <span className="mt-1 block text-xs text-red-600">
                  {fieldState.error.message}
                </span>
              ) : null}
            </label>
          )}
        />

        <Controller
          name="ruc"
          control={control}
          render={({ field, fieldState }) => (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">RUC *</span>
              <input
                {...field}
                inputMode="numeric"
                maxLength={11}
                placeholder="20123456789"
                className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
              />
              {fieldState.error ? (
                <span className="mt-1 block text-xs text-red-600">
                  {fieldState.error.message}
                </span>
              ) : null}
            </label>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            name="contactPersonName"
            control={control}
            render={({ field, fieldState }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Persona de contacto *
                </span>
                <input
                  {...field}
                  placeholder="Carlos Mendoza"
                  className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
                />
                {fieldState.error ? (
                  <span className="mt-1 block text-xs text-red-600">
                    {fieldState.error.message}
                  </span>
                ) : null}
              </label>
            )}
          />
          <Controller
            name="contactPersonRole"
            control={control}
            render={({ field, fieldState }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Cargo *</span>
                <input
                  {...field}
                  placeholder="Gerente de Operaciones"
                  className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
                />
                {fieldState.error ? (
                  <span className="mt-1 block text-xs text-red-600">
                    {fieldState.error.message}
                  </span>
                ) : null}
              </label>
            )}
          />
        </div>

        <Controller
          name="whatsapp"
          control={control}
          render={({ field, fieldState }) => (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                WhatsApp corporativo *
              </span>
              <input
                {...field}
                inputMode="tel"
                placeholder="987654321"
                className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
              />
              {fieldState.error ? (
                <span className="mt-1 block text-xs text-red-600">
                  {fieldState.error.message}
                </span>
              ) : null}
            </label>
          )}
        />

        <Controller
          name="profilePhotoUrl"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <CloudinaryImageUploader
                folder="profile"
                label="Logo o imagen de la empresa *"
                hint="Usa el logo oficial o una foto representativa de tus obras."
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] ?? "")}
                maxFiles={1}
                minFiles={1}
              />
              {fieldState.error ? (
                <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>
              ) : null}
            </div>
          )}
        />

        <Controller
          name="presentation"
          control={control}
          render={({ field, fieldState }) => (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Presentación de la empresa *
              </span>
              <textarea
                {...field}
                rows={4}
                placeholder="Empresa formal con experiencia en demolición, estructuras y acabados en Lima Sur."
                className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
              />
              {fieldState.error ? (
                <span className="mt-1 block text-xs text-red-600">
                  {fieldState.error.message}
                </span>
              ) : null}
            </label>
          )}
        />
      </>
    );
  }

  if (step === 1) {
    return (
      <>
        <Controller
          name="categorySlugs"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <MultiSelectPills
                label="Líneas de servicio *"
                hint="Selecciona todas las categorías que cubre tu empresa."
                options={catalog.categories.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
                value={field.value}
                onChange={field.onChange}
              />
              {fieldState.error ? (
                <p className="mt-2 text-xs text-red-600">{fieldState.error.message}</p>
              ) : null}
            </div>
          )}
        />

        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field, fieldState }) => (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Años de operación *
              </span>
              <input
                {...field}
                type="number"
                min={0}
                max={60}
                className="mt-2 w-full border border-slate-300 px-3 py-2.5 text-sm"
              />
              {fieldState.error ? (
                <span className="mt-1 block text-xs text-red-600">
                  {fieldState.error.message}
                </span>
              ) : null}
            </label>
          )}
        />

        <Controller
          name="capacitySlugs"
          control={control}
          render={({ field }) => (
            <MultiSelectPills
              label="Capacidad instalada"
              hint="Indica si cuentas con flota, maquinaria pesada o cuadrillas propias."
              options={capacityOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </>
    );
  }

  return null;
}
