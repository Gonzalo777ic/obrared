export type CatalogOption = {
  value: string;
  label: string;
};

export type WorkCategoryOption = {
  value: string;
  label: string;
  specialtySlugs: string[];
};

export type HomeCatalog = {
  specialties: CatalogOption[];
  machineryTypes: CatalogOption[];
  availabilityStatuses: CatalogOption[];
  workerLevels: CatalogOption[];
  categories: WorkCategoryOption[];
};
