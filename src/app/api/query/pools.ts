import type { Options } from "@hey-api/client-fetch";
import type {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
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
  ResourcePoolsWithSummaryListResponse,
  UpdateResourcePoolData,
  UpdateResourcePoolError,
  UpdateResourcePoolResponse,
  ValidationErrorBodyResponse,
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
): UseQueryResult<
  ResourcePoolsWithSummaryListResponse,
  ValidationErrorBodyResponse
> => {
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
): UseQueryResult<number, ValidationErrorBodyResponse> => {
  return useWebsocketAwareQuery({
    ...listResourcePoolsWithSummaryOptions(options),
    select: (data) => data?.total ?? 0,
  } as UseQueryOptions<
    ListResourcePoolsWithSummaryResponse,
    ListResourcePoolsWithSummaryError,
    number
  >);
};

export const useGetPool = (
  options: Options<GetResourcePoolData>
): UseQueryResult<GetResourcePoolResponse, GetResourcePoolError> => {
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
): UseMutationResult<
  CreateResourcePoolResponse,
  CreateResourcePoolError,
  Options<CreateResourcePoolData>
> => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateResourcePoolResponse,
    CreateResourcePoolError,
    Options<CreateResourcePoolData>
  >({
    ...createResourcePoolMutation(mutationOptions),
    onSuccess: async () => {
      return queryClient.invalidateQueries({
        queryKey: listResourcePoolsWithSummaryQueryKey(),
      });
    },
  });
};

export const useUpdatePool = (
  mutationOptions?: Options<UpdateResourcePoolData>
): UseMutationResult<
  UpdateResourcePoolResponse,
  UpdateResourcePoolError,
  Options<UpdateResourcePoolData>
> => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateResourcePoolResponse,
    UpdateResourcePoolError,
    Options<UpdateResourcePoolData>
  >({
    ...updateResourcePoolMutation(mutationOptions),
    onSuccess: async () => {
      return queryClient.invalidateQueries({
        queryKey: listResourcePoolsWithSummaryQueryKey(),
      });
    },
  });
};

export const useDeletePool = (
  mutationOptions?: Options<DeleteResourcePoolData>
): UseMutationResult<
  DeleteResourcePoolResponse,
  DeleteResourcePoolError,
  Options<DeleteResourcePoolData>
> => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteResourcePoolResponse,
    DeleteResourcePoolError,
    Options<DeleteResourcePoolData>
  >({
    ...deleteResourcePoolMutation(mutationOptions),
    onSuccess: async () => {
      return queryClient.invalidateQueries({
        queryKey: listResourcePoolsWithSummaryQueryKey(),
      });
    },
  });
};
