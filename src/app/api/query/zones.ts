import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  CreateZoneData,
  CreateZoneErrors,
  CreateZoneResponses,
  DeleteZoneData,
  DeleteZoneErrors,
  DeleteZoneResponses,
  GetZoneData,
  GetZoneErrors,
  GetZoneResponses,
  ListZonesData,
  ListZonesErrors,
  ListZonesResponses,
  ListZonesWithSummaryData,
  ListZonesWithSummaryErrors,
  ListZonesWithSummaryResponses,
  Options,
  UpdateZoneData,
  UpdateZoneErrors,
  UpdateZoneResponses,
} from "@/app/apiclient";
import {
  createZone,
  deleteZone,
  getZone,
  listZones,
  listZonesWithSummary,
  updateZone,
} from "@/app/apiclient";
import {
  getZoneQueryKey,
  listZonesQueryKey,
  listZonesWithSummaryQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useZones = (
  options?: Options<ListZonesWithSummaryData>,
  enabled?: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListZonesWithSummaryResponses,
      ListZonesWithSummaryErrors,
      ListZonesWithSummaryData
    >(options, listZonesWithSummary, listZonesWithSummaryQueryKey(options)),
    enabled: enabled !== undefined ? enabled : true,
  });
};

export const useBaseZones = (options?: Options<ListZonesData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<ListZonesResponses, ListZonesErrors, ListZonesData>(
      options,
      listZones,
      listZonesQueryKey(options)
    )
  );
};

export const useZoneCount = (options?: Options<ListZonesWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListZonesWithSummaryResponses,
      ListZonesWithSummaryErrors,
      ListZonesWithSummaryData
    >(options, listZonesWithSummary, listZonesWithSummaryQueryKey(options)),
    select: (data) => data?.total ?? 0,
  });
};

export const useGetZone = (options: Options<GetZoneData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<GetZoneResponses, GetZoneErrors, GetZoneData>(
      options,
      getZone,
      getZoneQueryKey(options)
    )
  );
};

export const useCreateZone = (mutationOptions?: Options<CreateZoneData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      CreateZoneResponses,
      CreateZoneErrors,
      CreateZoneData
    >(mutationOptions, createZone),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listZonesWithSummaryQueryKey(),
      });
    },
  });
};

export const useUpdateZone = (mutationOptions?: Options<UpdateZoneData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      UpdateZoneResponses,
      UpdateZoneErrors,
      UpdateZoneData
    >(mutationOptions, updateZone),
    onSuccess: async () => {
      return queryClient.invalidateQueries({
        queryKey: listZonesWithSummaryQueryKey(),
      });
    },
  });
};

export const useDeleteZone = (mutationOptions?: Options<DeleteZoneData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      DeleteZoneResponses,
      DeleteZoneErrors,
      DeleteZoneData
    >(mutationOptions, deleteZone),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listZonesWithSummaryQueryKey(),
      });
    },
  });
};
