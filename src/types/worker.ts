export type WorkerProfile = {
  id: string;
  fullName: string;
  specialtySlug: string;
  specialtyName: string;
  levelSlug: string;
  levelName: string;
  machinerySlug: string;
  machineryName: string;
  availabilitySlug: string;
  availabilityName: string;
  departmentCode: string;
  departmentName: string;
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  isFeatured: boolean;
  isVerified: boolean;
  updatedAt: string;
};

export type GuestHomeData = {
  workers: WorkerProfile[];
  catalog: import("@/types/catalog").HomeCatalog;
};
