"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { submitWorkerOnboardingAction } from "@/app/_actions/worker-onboarding";
import {
  COMPANY_ONBOARDING_STEPS,
  WORKER_ONBOARDING_STEPS,
} from "@/constants/worker-onboarding";
import { PUBLISHER_TYPES, type PublisherType } from "@/constants/publisher-type";
import { WORKER_NAV_CTA } from "@/constants/user-nav";
import {
  buildOnboardingPayload,
  defaultOnboardingFormValues,
  type OnboardingFormValues,
} from "@/schemas/worker-onboarding.schema";
import type { HomeCatalog } from "@/types/catalog";

import { CompanyOnboardingSteps } from "./company-onboarding-steps";
import { IndividualOnboardingSteps } from "./individual-onboarding-steps";
import {
  getStepFieldsForPublisher,
  validateOnboardingStep,
} from "./onboarding-validation";
import { PublisherTypeSelector } from "./publisher-type-selector";
import { SharedOnboardingSteps } from "./shared-onboarding-steps";

type WorkerOnboardingFormProps = {
  catalog: HomeCatalog;
  fullName: string | null;
  defaultProfilePhotoUrl: string | null;
};

export function WorkerOnboardingForm({
  catalog,
  fullName,
  defaultProfilePhotoUrl,
}: WorkerOnboardingFormProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<"choose-type" | "form">("choose-type");
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormValues>({
    defaultValues: {
      ...defaultOnboardingFormValues,
      profilePhotoUrl: defaultProfilePhotoUrl ?? "",
    },
  });

  const { control, handleSubmit, watch, setValue, trigger, getValues } = form;

  const publisherType = watch("publisherType");
  const departmentCode = watch("departmentCode");
  const cityCode = watch("cityCode");
  const profilePhotoUrl = watch("profilePhotoUrl");

  const steps =
    publisherType === PUBLISHER_TYPES.company.value
      ? COMPANY_ONBOARDING_STEPS
      : WORKER_ONBOARDING_STEPS;

  const handleSelectPublisherType = (type: PublisherType) => {
    setValue("publisherType", type);
    setPhase("form");
    setStep(0);
    setFormError(null);
  };

  const validateCurrentStep = async () => {
    const values = getValues();
    const result = validateOnboardingStep(values, step);

    if (!result.success) {
      if (result.message) setFormError(result.message);
      await trigger(getStepFieldsForPublisher(values.publisherType, step));
      return false;
    }

    setFormError(null);
    return trigger(getStepFieldsForPublisher(values.publisherType, step));
  };

  const goNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setFormError(null);
    if (step === 0) {
      setPhase("choose-type");
      return;
    }
    setStep((current) => Math.max(current - 1, 0));
  };

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    setFormError(null);

    const payload = buildOnboardingPayload(values);
    if (!payload) {
      setFormError("Selecciona cómo deseas publicarte.");
      setIsSubmitting(false);
      return;
    }

    const result = await submitWorkerOnboardingAction(payload);
    setIsSubmitting(false);

    if ("error" in result && result.error) {
      setFormError(result.error);
      return;
    }

    router.push(WORKER_NAV_CTA.adsPanel.href);
    router.refresh();
  });

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
        Publicar anuncios
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
        {phase === "choose-type"
          ? "¿Cómo quieres publicarte en ObraRed?"
          : publisherType === PUBLISHER_TYPES.company.value
            ? "Registro de empresa"
            : "Registro profesional"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {phase === "choose-type"
          ? "Elige una opción. Solo podrás crear un perfil público por cuenta."
          : fullName
            ? `Hola ${fullName}, completa tu perfil para aparecer en búsquedas por distrito.`
            : "Completa tu perfil para aparecer en búsquedas por distrito."}
      </p>

      {phase === "choose-type" ? (
        <PublisherTypeSelector onSelect={handleSelectPublisherType} />
      ) : (
        <>
          <div className="mt-6 grid gap-2 sm:grid-cols-4">
            {steps.map((item, index) => (
              <div
                key={item.id}
                className={`border px-3 py-2 text-xs font-semibold ${
                  index === step
                    ? "border-amber-500 bg-amber-50 text-amber-800"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {index + 1}. {item.label}
              </div>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-6 space-y-6 border border-slate-200 bg-white p-5"
          >
            {publisherType === PUBLISHER_TYPES.individual.value ? (
              <IndividualOnboardingSteps
                control={control}
                catalog={catalog}
                step={step}
                defaultProfilePhotoUrl={defaultProfilePhotoUrl}
                profilePhotoUrl={profilePhotoUrl}
              />
            ) : (
              <CompanyOnboardingSteps
                control={control}
                catalog={catalog}
                step={step}
              />
            )}

            <SharedOnboardingSteps
              control={control}
              setValue={setValue}
              getValues={getValues}
              catalog={catalog}
              departmentCode={departmentCode}
              cityCode={cityCode}
              step={step}
              coverageHint={
                publisherType === PUBLISHER_TYPES.company.value
                  ? "Distritos donde tu empresa puede ejecutar obras."
                  : "Distritos donde estás dispuesto a trabajar."
              }
              galleryLabel={
                publisherType === PUBLISHER_TYPES.company.value
                  ? "Portafolio de obras"
                  : "Fotos de obras"
              }
            />

            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 disabled:opacity-50"
              >
                Atrás
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => void goNext()}
                  className="inline-flex items-center justify-center bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {isSubmitting ? "Publicando..." : "Publicar mi perfil"}
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </section>
  );
}
