export const PUBLISHER_TYPES = {
  individual: {
    value: "individual",
    title: "Soy Profesional Independiente",
    description: "Maestros, operarios, técnicos y especialistas por cuenta propia.",
  },
  company: {
    value: "company",
    title: "Somos una Empresa / Contratista",
    description: "Persona jurídica o equipos formados que pueden facturar obras.",
  },
} as const;

export type PublisherType =
  (typeof PUBLISHER_TYPES)[keyof typeof PUBLISHER_TYPES]["value"];

export const COMPANY_DOCUMENT_TYPE = "ruc" as const;

export const COMPANY_CAPACITY_SLUGS = [
  "flota-vehicular",
  "maquinaria-pesada",
  "cuadrillas-propias",
] as const;
