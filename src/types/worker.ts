export type WorkerCoverageDistrict = {
  districtCode: string;
  districtName: string;
  cityCode: string;
  cityName: string;
  departmentCode: string;
  departmentName: string;
};

export type WorkerImage = {
  id: string;
  url: string;
  altText: string | null;
  description: string | null;
  sortOrder: number;
};

export type WorkerProfile = {
  id: string;
  publisherType: string;
  fullName: string;
  businessName: string | null;
  whatsapp: string;
  specialtySlug: string;
  specialtyName: string;
  specialtySlugs: string[];
  categorySlugs: string[];
  categoryNames: string[];
  levelSlug: string;
  levelName: string;
  machinerySlug: string;
  machineryName: string;
  machinerySlugs: string[];
  availabilitySlug: string;
  availabilityName: string;
  departmentCode: string;
  departmentName: string;
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  coverageDistricts: WorkerCoverageDistrict[];
  subscriptionScore: number;
  updatedAt: string;
  images: WorkerImage[];
};

export type WorkerReviewPhoto = {
  id: string;
  url: string;
  sortOrder: number;
};

export type WorkerReview = {
  id: string;
  body: string;
  rating: number;
  createdAt: string;
  authorName: string;
  images: WorkerReviewPhoto[];
};

export type PublicWorkerDetail = WorkerProfile & {
  presentation: string | null;
  profilePhotoUrl: string | null;
  yearsOfExperience: number;
  contactPersonName: string | null;
  contactPersonRole: string | null;
  reviews: WorkerReview[];
  averageRating: number | null;
  reviewCount: number;
};

export type MyWorkerAd = WorkerProfile & {
  presentation: string | null;
  profilePhotoUrl: string | null;
  yearsOfExperience: number;
  documentType: string;
  documentNumber: string;
  contactPersonName: string | null;
  contactPersonRole: string | null;
};

export type GuestHomeData = {
  workers: WorkerProfile[];
  catalog: import("@/types/catalog").HomeCatalog;
};
