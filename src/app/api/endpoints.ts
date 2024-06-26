import { fetchWithAuth, getFullApiUrl } from "@/app/api/base";
import type { Zone } from "@/app/store/zone/types";

export const fetchZones = (): Promise<Zone[]> =>
  fetchWithAuth(getFullApiUrl("zones"));
