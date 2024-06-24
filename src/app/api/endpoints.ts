import { ROOT_API, fetchWithAuth } from "@/app/api/base";
import type { Zone } from "@/app/store/zone/types";

export const fetchZones = (): Promise<Zone[]> =>
  fetchWithAuth(`${ROOT_API}zones/`);
