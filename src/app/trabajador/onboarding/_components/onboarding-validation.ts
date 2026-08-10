import {
  companyOnboardingSchema,
  individualOnboardingSchema,
  type OnboardingFormValues,
} from "@/schemas/worker-onboarding.schema";
import { PUBLISHER_TYPES } from "@/constants/publisher-type";

const individualStepFields: (keyof OnboardingFormValues)[][] = [
  ["whatsapp", "documentType", "documentNumber", "profilePhotoUrl", "presentation"],
  ["specialtySlugs", "yearsOfExperience", "levelSlug", "machinerySlugs"],
  [
    "availabilitySlug",
    "departmentCode",
    "cityCode",
    "districtCode",
    "coverageDistrictCodes",
  ],
  ["galleryPhotoUrls"],
];

const companyStepFields: (keyof OnboardingFormValues)[][] = [
  [
    "businessName",
    "ruc",
    "contactPersonName",
    "contactPersonRole",
    "whatsapp",
    "profilePhotoUrl",
    "presentation",
  ],
  ["categorySlugs", "yearsOfExperience", "capacitySlugs"],
  [
    "availabilitySlug",
    "departmentCode",
    "cityCode",
    "districtCode",
    "coverageDistrictCodes",
  ],
  ["galleryPhotoUrls"],
];

function pickValues<T extends object>(source: T, keys: (keyof T)[]) {
  return Object.fromEntries(keys.map((key) => [key, source[key]]));
}

export function validateOnboardingStep(
  values: OnboardingFormValues,
  step: number,
) {
  if (!values.publisherType) {
    return { success: false as const, message: "Selecciona cómo deseas publicarte." };
  }

  const fields =
    values.publisherType === PUBLISHER_TYPES.company.value
      ? companyStepFields[step]
      : individualStepFields[step];

  const partial = pickValues(values, fields);

  if (values.publisherType === PUBLISHER_TYPES.company.value) {
    const schema =
      step === 0
        ? companyOnboardingSchema.pick({
            whatsapp: true,
            profilePhotoUrl: true,
            presentation: true,
            businessName: true,
            ruc: true,
            contactPersonName: true,
            contactPersonRole: true,
          })
        : step === 1
          ? companyOnboardingSchema.pick({
              categorySlugs: true,
              yearsOfExperience: true,
              capacitySlugs: true,
            })
          : step === 2
            ? companyOnboardingSchema.pick({
                availabilitySlug: true,
                departmentCode: true,
                cityCode: true,
                districtCode: true,
                coverageDistrictCodes: true,
              })
            : companyOnboardingSchema.pick({ galleryPhotoUrls: true });

    const parsed = schema.safeParse({
      publisherType: values.publisherType,
      ...partial,
    });

    if (!parsed.success) {
      return {
        success: false as const,
        message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    return { success: true as const };
  }

  const schema =
    step === 0
      ? individualOnboardingSchema.pick({
          whatsapp: true,
          documentType: true,
          documentNumber: true,
          profilePhotoUrl: true,
          presentation: true,
        })
      : step === 1
        ? individualOnboardingSchema.pick({
            specialtySlugs: true,
            yearsOfExperience: true,
            levelSlug: true,
            machinerySlugs: true,
          })
        : step === 2
          ? individualOnboardingSchema.pick({
              availabilitySlug: true,
              departmentCode: true,
              cityCode: true,
              districtCode: true,
              coverageDistrictCodes: true,
            })
          : individualOnboardingSchema.pick({ galleryPhotoUrls: true });

  const parsed = schema.safeParse({
    publisherType: values.publisherType,
    ...partial,
  });

  if (!parsed.success) {
    return {
      success: false as const,
      message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  return { success: true as const };
}

export function getStepFieldsForPublisher(
  publisherType: OnboardingFormValues["publisherType"],
  step: number,
) {
  if (publisherType === PUBLISHER_TYPES.company.value) {
    return companyStepFields[step] ?? [];
  }

  if (publisherType === PUBLISHER_TYPES.individual.value) {
    return individualStepFields[step] ?? [];
  }

  return [];
}
