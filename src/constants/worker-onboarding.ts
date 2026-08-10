export const DOCUMENT_TYPES = {
  dni: { value: "dni", label: "DNI" },
  ce: { value: "ce", label: "Carnet de Extranjería" },
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPES;

export const WORKER_ONBOARDING_STEPS = [
  { id: "identity", label: "Identidad y contacto" },
  { id: "technical", label: "Perfil técnico" },
  { id: "logistics", label: "Logística" },
  { id: "gallery", label: "Galería" },
] as const;

export const COMPANY_ONBOARDING_STEPS = [
  { id: "identity", label: "Datos de la empresa" },
  { id: "technical", label: "Servicios y capacidad" },
  { id: "logistics", label: "Cobertura" },
  { id: "gallery", label: "Portafolio" },
] as const;

export const WORKER_GALLERY_LIMITS = {
  min: 0,
  max: 5,
} as const;

export const WORKER_GALLERY_RECOMMENDATION =
  "Muy recomendado: sube fotos de trabajos terminados o en proceso. Los perfiles con galería reciben muchos más contactos.";

export const CLOUDINARY_FOLDERS = {
  profile: "obrared/workers/profile",
  gallery: "obrared/workers/gallery",
} as const;

export const AVAILABILITY_ONBOARDING_SLUGS = {
  available: "libre",
  onJob: "en-obra",
} as const;
