import type { Options } from "@hey-api/client-fetch";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  CreateResourcePoolData,
  CreateResourcePoolError,
  CreateResourcePoolResponse,
  DeleteResourcePoolData,
  DeleteResourcePoolError,
  DeleteResourcePoolResponse,
  GetResourcePoolData,
  GetResourcePoolError,
  GetResourcePoolResponse,
  ListResourcePoolsWithSummaryData,
  ListResourcePoolsWithSummaryError,
  ListResourcePoolsWithSummaryResponse,
  UpdateResourcePoolData,
  UpdateResourcePoolError,
  UpdateResourcePoolResponse,
} from "@/app/apiclient";
import {
  createResourcePoolMutation,
  deleteResourcePoolMutation,
  getResourcePoolOptions,
  listResourcePoolsWithSummaryOptions,
  listResourcePoolsWithSummaryQueryKey,
  updateResourcePoolMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const usePools = (
  options?: Options<ListResourcePoolsWithSummaryData>
) => {
  return useWebsocketAwareQuery(
    listResourcePoolsWithSummaryOptions(options) as UseQueryOptions<
      ListResourcePoolsWithSummaryData,
      ListResourcePoolsWithSummaryError,
      ListResourcePoolsWithSummaryResponse
    >
  );
};

export const usePoolCount = (
  options?: Options<ListResourcePoolsWithSummaryData>
) => {
  return useWebsocketAwareQuery({
    ...listResourcePoolsWithSummaryOptions(options),
    select: (data) => data?.items.length ?? 0,
  } as UseQueryOptions<
    ListResourcePoolsWithSummaryResponse,
    ListResourcePoolsWithSummaryResponse,
    number
  >);
};

export const useGetPool = (options: Options<GetResourcePoolData>) => {
  return useWebsocketAwareQuery(
    getResourcePoolOptions(options) as UseQueryOptions<
      GetResourcePoolResponse,
      GetResourcePoolError,
      GetResourcePoolResponse
    >
  );
};

export const useCreatePool = (
  mutationOptions?: Options<CreateResourcePoolData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateResourcePoolResponse,
    CreateResourcePoolError,
    Options<CreateResourcePoolData>
  >({
    ...createResourcePoolMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listResourcePoolsWithSummaryQueryKey(),
      });
    },
  });
};

export const useUpdatePool = (
  mutationOptions?: Options<UpdateResourcePoolData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateResourcePoolResponse,
    UpdateResourcePoolError,
    Options<UpdateResourcePoolData>
  >({
    ...updateResourcePoolMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listResourcePoolsWithSummaryQueryKey(),
      });
    },
  });
};

export const useDeletePool = (
  mutationOptions?: Options<DeleteResourcePoolData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteResourcePoolResponse,
    DeleteResourcePoolError,
    Options<DeleteResourcePoolData>
  >({
    ...deleteResourcePoolMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listResourcePoolsWithSummaryQueryKey(),
      });
    },
  });
};
