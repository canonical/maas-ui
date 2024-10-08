import { selectById } from "./utils";

import { fetchZones } from "@/app/api/endpoints";
import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type { Zone, ZonePK } from "@/app/store/zone/types";

const zoneKeys = {
  list: ["zones"] as const,
};

export const useZones = () => {
  return useWebsocketAwareQuery(zoneKeys.list, fetchZones);
};

export const useZoneCount = () =>
  useWebsocketAwareQuery<Zone[], Zone[], number>(["zones"], fetchZones, {
    select: (data) => data?.length ?? 0,
  });

export const useZoneById = (id?: ZonePK | null) =>
  useWebsocketAwareQuery(zoneKeys.list, fetchZones, {
    select: selectById<Zone>(id ?? null),
  });
