import type { Options } from "@hey-api/client-fetch";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type {
  CreateZoneData,
  CreateZoneResponse,
  ZoneResponse,
  ZonesListResponse,
} from "@/app/apiclient/codegen";
import {
  createZoneMutation,
  listZonesOptions,
} from "@/app/apiclient/codegen/@tanstack/react-query.gen";
import type { ZonePK } from "@/app/store/zone/types";

export const useZones = () => {
  return useWebsocketAwareQuery(
    listZonesOptions() as UseQueryOptions<
      ZonesListResponse,
      Error,
      ZonesListResponse
    >
  );
};

export const useZoneCount = () => {
  return useWebsocketAwareQuery({
    ...listZonesOptions(),
    select: (data) => data?.items.length ?? 0,
  } as UseQueryOptions<ZonesListResponse, ZonesListResponse, number>);
};

export const useZoneById = (id?: ZonePK | null) => {
  return useWebsocketAwareQuery({
    ...listZonesOptions(),
    select: (data) => data.items.find((item) => item.id === id) || null,
  } as UseQueryOptions<ZonesListResponse, Error, ZoneResponse>);
};

export const useCreateZone = (
  mutationOptions?: Partial<Options<CreateZoneData>>
) => {
  return useMutation<CreateZoneResponse, Error, Options<CreateZoneData>>(
    createZoneMutation(mutationOptions)
  );
};
