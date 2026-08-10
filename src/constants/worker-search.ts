export const WORKER_SEARCH_FILTER_LABELS = {
  specialty: "Especialidad",
  machinery: "Maquinaria",
  availability: "Disponibilidad",
  department: "Departamento",
  province: "Provincia",
  district: "Distrito de cobertura",
  category: "Línea de servicio",
  capacity: "Capacidad instalada",
} as const;

export const LOCATION_SEARCH_MODES = {
  manual: "manual",
  device: "device",
} as const;

export type LocationSearchMode =
  (typeof LOCATION_SEARCH_MODES)[keyof typeof LOCATION_SEARCH_MODES];
