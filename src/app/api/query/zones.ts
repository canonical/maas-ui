import type { Options } from "@hey-api/client-fetch";
import type {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
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
  ValidationErrorBodyResponse,
  ZonesWithSummaryListResponse,
} from "@/app/apiclient";
import {
  createZoneMutation,
  deleteZoneMutation,
  getZoneOptions,
  listZonesQueryKey,
  listZonesWithSummaryOptions,
  updateZoneMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useZones = (
  options?: Options<ListZonesWithSummaryData>
): UseQueryResult<
  ZonesWithSummaryListResponse,
  ValidationErrorBodyResponse
> => {
  return useWebsocketAwareQuery(
    listZonesWithSummaryOptions(options) as UseQueryOptions<
      ListZonesWithSummaryResponse,
      ListZonesWithSummaryError,
      ListZonesWithSummaryResponse
    >
  );
};

export const useZoneCount = (
  options?: Options<ListZonesWithSummaryData>
): UseQueryResult<number, ValidationErrorBodyResponse> => {
  return useWebsocketAwareQuery({
    ...listZonesWithSummaryOptions(options),
    select: (data) => data?.total ?? 0,
  } as UseQueryOptions<
    ListZonesWithSummaryResponse,
    ListZonesWithSummaryError,
    number
  >);
};

export const useGetZone = (
  options: Options<GetZoneData>
): UseQueryResult<GetZoneResponse, GetZoneError> => {
  return useWebsocketAwareQuery(
    getZoneOptions(options) as UseQueryOptions<
      GetZoneResponse,
      GetZoneError,
      GetZoneResponse
    >
  );
};

export const useCreateZone = (
  mutationOptions?: Options<CreateZoneData>
): UseMutationResult<
  CreateZoneResponse,
  CreateZoneError,
  Options<CreateZoneData>
> => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateZoneResponse,
    CreateZoneError,
    Options<CreateZoneData>
  >({
    ...createZoneMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listZonesQueryKey(),
      });
    },
  });
};

export const useUpdateZone = (
  mutationOptions?: Options<UpdateZoneData>
): UseMutationResult<
  UpdateZoneResponse,
  UpdateZoneError,
  Options<UpdateZoneData>
> => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateZoneResponse,
    UpdateZoneError,
    Options<UpdateZoneData>
  >({
    ...updateZoneMutation(mutationOptions),
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: listZonesQueryKey() });
    },
  });
};

export const useDeleteZone = (
  mutationOptions?: Options<DeleteZoneData>
): UseMutationResult<
  DeleteZoneResponse,
  DeleteZoneError,
  Options<DeleteZoneData>
> => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteZoneResponse,
    DeleteZoneError,
    Options<DeleteZoneData>
  >({
    ...deleteZoneMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listZonesQueryKey() });
    },
  });
};
