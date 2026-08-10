import { z } from "zod";

import { LOCATION_SEARCH_MODES } from "@/constants/worker-search";

export const workerSearchSchema = z.object({
  specialty: z.string(),
  machinery: z.string(),
  availability: z.string(),
  departmentCode: z.string(),
  cityCode: z.string(),
  districtCode: z.string(),
  category: z.string(),
  locationMode: z.enum([
    LOCATION_SEARCH_MODES.manual,
    LOCATION_SEARCH_MODES.device,
  ]),
});

export type WorkerSearchInput = z.infer<typeof workerSearchSchema>;
