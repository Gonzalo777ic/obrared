"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import { importRemoteProfilePhotoAction } from "@/app/_actions/worker-onboarding";
import { CloudinaryImageUploader } from "@/components/ui/cloudinary-image-uploader";
import { MultiSelectPills } from "@/components/ui/multi-select-pills";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { DOCUMENT_TYPES } from "@/constants/worker-onboarding";
import type { OnboardingFormValues } from "@/schemas/worker-onboarding.schema";
import type { HomeCatalog } from "@/types/catalog";

const emptyOption = { value: "", label: "Seleccionar" };

type IndividualStepsProps = {
  control: Control<OnboardingFormValues>;
  catalog: HomeCatalog;
  step: number;
  defaultProfilePhotoUrl: string | null;
  profilePhotoUrl: string;
};

export function IndividualOnboardingSteps({
  control,
  catalog,
  step,
  defaultProfilePhotoUrl,
  profilePhotoUrl,
}: IndividualStepsProps) {
  const machineryOptions = catalog.machineryTypes.filter(
    (item) => item.value !== "ninguna",
  );

  if (step === 0) {
    return (
      <>
        <Controller
          name="whatsapp"
          control={control}
          render={({ field, fieldState }) => (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">WhatsApp *</span>
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

        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            name="documentType"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={Object.values(DOCUMENT_TYPES)}
                placeholder="Tipo de documento"
                aria-label="Tipo de documento"
              />
            )}
          />
          <Controller
            name="documentNumber"
            control={control}
            render={({ field, fieldState }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Número de documento *
                </span>
                <input
                  {...field}
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
          name="profilePhotoUrl"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <CloudinaryImageUploader
                folder="profile"
                label="Foto de perfil *"
                hint="Usa una foto profesional o en obra."
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] ?? "")}
                maxFiles={1}
                minFiles={1}
              />
              {defaultProfilePhotoUrl && !profilePhotoUrl ? (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-amber-700"
                  onClick={() => {
                    void importRemoteProfilePhotoAction(defaultProfilePhotoUrl).then(
                      (result) => {
                        if (result.url) field.onChange(result.url);
                      },
                    );
                  }}
                >
                  Usar foto de mi cuenta Google (optimizada)
                </button>
              ) : null}
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
                Presentación breve *
              </span>
              <textarea
                {...field}
                rows={4}
                placeholder="Soy un maestro detallista, dejo todo limpio al terminar."
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
          name="specialtySlugs"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <MultiSelectPills
                label="Oficios *"
                hint="Puedes marcar Albañilería, Encofrado y Pintura al mismo tiempo."
                options={catalog.specialties}
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
                Años de experiencia *
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
          name="levelSlug"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={[emptyOption, ...catalog.workerLevels]}
                placeholder="Nivel o rango"
                aria-label="Nivel o rango"
              />
              {fieldState.error ? (
                <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>
              ) : null}
            </div>
          )}
        />

        <Controller
          name="machinerySlugs"
          control={control}
          render={({ field }) => (
            <MultiSelectPills
              label="Maquinaria / herramientas propias"
              hint="Selecciona lo que aportas a la obra."
              options={machineryOptions}
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
