import { fetchWithAuth, getFullApiUrl } from "@/app/api/base";
import type { Zone } from "@/app/store/zone/types";

/**
 * Fetches a list of zones.
 *
 * @returns The list of zones
 */
export const fetchZones = (): Promise<Zone[]> =>
  fetchWithAuth(getFullApiUrl("zones"));
