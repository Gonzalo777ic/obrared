import { z } from "zod";

import { PUBLISHER_TYPES } from "@/constants/publisher-type";

const phoneRegex = /^(\+51)?9\d{8}$/;

const sharedLogisticsSchema = z.object({
  whatsapp: z
    .string()
    .trim()
    .regex(phoneRegex, "Ingresa un WhatsApp peruano válido (9 dígitos)."),
  profilePhotoUrl: z.string().url("Sube una imagen."),
  presentation: z
    .string()
    .trim()
    .min(20, "Escribe al menos 20 caracteres.")
    .max(280, "Máximo 280 caracteres."),
  yearsOfExperience: z.coerce
    .number()
    .int()
    .min(0, "Mínimo 0 años.")
    .max(60, "Máximo 60 años."),
  availabilitySlug: z.enum(["libre", "en-obra"]),
  departmentCode: z.string().min(1, "Selecciona departamento."),
  cityCode: z.string().min(1, "Selecciona provincia."),
  districtCode: z.string().min(1, "Selecciona distrito base."),
  coverageDistrictCodes: z
    .array(z.string())
    .min(1, "Selecciona al menos un distrito de cobertura."),
  galleryPhotoUrls: z.array(z.string().url()).max(5, "Máximo 5 fotos."),
});

export const individualOnboardingSchema = sharedLogisticsSchema.extend({
  publisherType: z.literal(PUBLISHER_TYPES.individual.value),
  documentType: z.enum(["dni", "ce"]),
  documentNumber: z
    .string()
    .trim()
    .min(8, "Documento inválido.")
    .max(12, "Documento inválido."),
  specialtySlugs: z
    .array(z.string())
    .min(1, "Selecciona al menos un oficio."),
  levelSlug: z.string().min(1, "Selecciona tu nivel."),
  machinerySlugs: z.array(z.string()).default([]),
});

export const companyOnboardingSchema = sharedLogisticsSchema.extend({
  publisherType: z.literal(PUBLISHER_TYPES.company.value),
  ruc: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "Ingresa un RUC válido de 11 dígitos."),
  businessName: z
    .string()
    .trim()
    .min(3, "Ingresa la razón social o nombre comercial."),
  contactPersonName: z
    .string()
    .trim()
    .min(3, "Ingresa el nombre del contacto."),
  contactPersonRole: z
    .string()
    .trim()
    .min(2, "Ingresa el cargo del contacto."),
  categorySlugs: z
    .array(z.string())
    .min(1, "Selecciona al menos una línea de servicio."),
  capacitySlugs: z.array(z.string()).default([]),
});

export const workerOnboardingSchema = z.discriminatedUnion("publisherType", [
  individualOnboardingSchema,
  companyOnboardingSchema,
]);

export type IndividualOnboardingInput = z.infer<typeof individualOnboardingSchema>;
export type CompanyOnboardingInput = z.infer<typeof companyOnboardingSchema>;
export type WorkerOnboardingInput = z.infer<typeof workerOnboardingSchema>;

export type OnboardingFormValues = {
  publisherType: "" | IndividualOnboardingInput["publisherType"] | CompanyOnboardingInput["publisherType"];
  whatsapp: string;
  profilePhotoUrl: string;
  presentation: string;
  yearsOfExperience: number;
  availabilitySlug: "libre" | "en-obra";
  departmentCode: string;
  cityCode: string;
  districtCode: string;
  coverageDistrictCodes: string[];
  galleryPhotoUrls: string[];
  documentType: "dni" | "ce";
  documentNumber: string;
  specialtySlugs: string[];
  levelSlug: string;
  machinerySlugs: string[];
  ruc: string;
  businessName: string;
  contactPersonName: string;
  contactPersonRole: string;
  categorySlugs: string[];
  capacitySlugs: string[];
};

export const defaultOnboardingFormValues: OnboardingFormValues = {
  publisherType: "",
  whatsapp: "",
  profilePhotoUrl: "",
  presentation: "",
  yearsOfExperience: 0,
  availabilitySlug: "libre",
  departmentCode: "",
  cityCode: "",
  districtCode: "",
  coverageDistrictCodes: [],
  galleryPhotoUrls: [],
  documentType: "dni",
  documentNumber: "",
  specialtySlugs: [],
  levelSlug: "",
  machinerySlugs: [],
  ruc: "",
  businessName: "",
  contactPersonName: "",
  contactPersonRole: "",
  categorySlugs: [],
  capacitySlugs: [],
};

export function buildOnboardingPayload(
  values: OnboardingFormValues,
): WorkerOnboardingInput | null {
  if (values.publisherType === PUBLISHER_TYPES.individual.value) {
    return {
      publisherType: values.publisherType,
      whatsapp: values.whatsapp,
      profilePhotoUrl: values.profilePhotoUrl,
      presentation: values.presentation,
      yearsOfExperience: values.yearsOfExperience,
      availabilitySlug: values.availabilitySlug,
      departmentCode: values.departmentCode,
      cityCode: values.cityCode,
      districtCode: values.districtCode,
      coverageDistrictCodes: values.coverageDistrictCodes,
      galleryPhotoUrls: values.galleryPhotoUrls,
      documentType: values.documentType,
      documentNumber: values.documentNumber,
      specialtySlugs: values.specialtySlugs,
      levelSlug: values.levelSlug,
      machinerySlugs: values.machinerySlugs,
    };
  }

  if (values.publisherType === PUBLISHER_TYPES.company.value) {
    return {
      publisherType: values.publisherType,
      whatsapp: values.whatsapp,
      profilePhotoUrl: values.profilePhotoUrl,
      presentation: values.presentation,
      yearsOfExperience: values.yearsOfExperience,
      availabilitySlug: values.availabilitySlug,
      departmentCode: values.departmentCode,
      cityCode: values.cityCode,
      districtCode: values.districtCode,
      coverageDistrictCodes: values.coverageDistrictCodes,
      galleryPhotoUrls: values.galleryPhotoUrls,
      ruc: values.ruc,
      businessName: values.businessName,
      contactPersonName: values.contactPersonName,
      contactPersonRole: values.contactPersonRole,
      categorySlugs: values.categorySlugs,
      capacitySlugs: values.capacitySlugs,
    };
  }

  return null;
}
