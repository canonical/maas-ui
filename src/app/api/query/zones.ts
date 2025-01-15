import { selectById } from "./utils";

import { fetchZones } from "@/app/api/endpoints";
import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type { Zone, ZonePK } from "@/app/store/zone/types";

const zoneKeys = {
  list: ["zones"] as const,
};

/**
 * Fetches a list of zones.
 *
 * @returns The zones list as a UseQueryResult
 */
export const useZones = () => {
  return useWebsocketAwareQuery(zoneKeys.list, fetchZones);
};

/**
 * Fetches the number of zones.
 * @returns The number of zones as a UseQueryResult
 */
export const useZoneCount = () =>
  useWebsocketAwareQuery<Zone[], Zone[], number>(["zones"], fetchZones, {
    select: (data) => data?.length ?? 0,
  });

/**
 * Get a zone by its ID from the list result.
 * @param id The zone's ID
 * @returns A Zone, or null as a UseQueryResult
 */
export const useZoneById = (id?: ZonePK | null) =>
  useWebsocketAwareQuery(zoneKeys.list, fetchZones, {
    select: selectById<Zone>(id ?? null),
  });
