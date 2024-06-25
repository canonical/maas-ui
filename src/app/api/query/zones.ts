import { fetchZones } from "@/app/api/endpoints";
import { useWebsocketAwareQuery } from "@/app/api/query/base";
import { useItemsCount } from "@/app/api/query/utils";

export const useZones = () => {
  return useWebsocketAwareQuery(["zones"], fetchZones);
};

export const useZonesCount = () => useItemsCount(useZones);
