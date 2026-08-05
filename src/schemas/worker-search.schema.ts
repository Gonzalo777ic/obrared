import { z } from "zod";

export const workerSearchSchema = z.object({
  specialty: z.string(),
  machinery: z.string(),
  availability: z.string(),
  departmentCode: z.string(),
  cityCode: z.string(),
  districtCode: z.string(),
  category: z.string(),
});

export type WorkerSearchInput = z.infer<typeof workerSearchSchema>;
