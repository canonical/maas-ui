import type { Options } from "@hey-api/client-fetch";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type {
  CreateZoneData,
  CreateZoneError,
  CreateZoneResponse,
  DeleteZoneData,
  DeleteZoneError,
  DeleteZoneResponse,
  GetZoneData,
  GetZoneError,
  GetZoneResponse,
  ListZonesWithSummaryData,
  ListZonesWithSummaryError,
  ListZonesWithSummaryResponse,
  UpdateZoneData,
  UpdateZoneError,
  UpdateZoneResponse,
} from "@/app/apiclient";
import {
  createZoneMutation,
  deleteZoneMutation,
  getZoneOptions,
  getZoneQueryKey,
  listZonesQueryKey,
  listZonesWithSummaryOptions,
  updateZoneMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useZones = (options?: Options<ListZonesWithSummaryData>) => {
  return useWebsocketAwareQuery(
    listZonesWithSummaryOptions(options) as UseQueryOptions<
      ListZonesWithSummaryResponse,
      ListZonesWithSummaryError,
      ListZonesWithSummaryResponse
    >
  );
};

export const useZoneCount = (options?: Options<ListZonesWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...listZonesWithSummaryOptions(options),
    select: (data) => data?.items.length ?? 0,
  } as UseQueryOptions<
    ListZonesWithSummaryResponse,
    ListZonesWithSummaryResponse,
    number
  >);
};

export const useGetZone = (options: Options<GetZoneData>) => {
  return useWebsocketAwareQuery(
    getZoneOptions(options) as UseQueryOptions<
      GetZoneResponse,
      GetZoneError,
      GetZoneResponse
    >
  );
};

export const useCreateZone = (
  mutationOptions?: Partial<Options<CreateZoneData>>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateZoneResponse,
    CreateZoneError,
    Options<CreateZoneData>
  >({
    ...createZoneMutation(mutationOptions),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: listZonesQueryKey(),
        })
        .then();
    },
  });
};

export const useUpdateZone = (
  mutationOptions?: Partial<Options<UpdateZoneData>>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateZoneResponse,
    UpdateZoneError,
    Options<UpdateZoneData>
  >({
    ...updateZoneMutation(mutationOptions),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: getZoneQueryKey({
            path: { zone_id: mutationOptions?.path?.zone_id! },
          }),
        })
        .then();
      queryClient.invalidateQueries({ queryKey: listZonesQueryKey() }).then();
    },
  });
};

export const useDeleteZone = (
  mutationOptions?: Partial<Options<DeleteZoneData>>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteZoneResponse,
    DeleteZoneError,
    Options<DeleteZoneData>
  >({
    ...deleteZoneMutation(mutationOptions),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: getZoneQueryKey({
            path: { zone_id: mutationOptions?.path?.zone_id! },
          }),
        })
        .then();
      queryClient.invalidateQueries({ queryKey: listZonesQueryKey() }).then();
    },
  });
};
