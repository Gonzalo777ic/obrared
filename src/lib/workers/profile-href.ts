import { PUBLISHER_TYPES } from "@/constants/publisher-type";

export function getWorkerProfileHref(worker: {
  id: string;
  publisherType: string;
}) {
  return worker.publisherType === PUBLISHER_TYPES.company.value
    ? `/empresas/${worker.id}`
    : `/trabajadores/${worker.id}`;
}
