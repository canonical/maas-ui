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
  listResourcePoolsQueryKey,
  listResourcePoolsWithSummaryOptions,
  updateResourcePoolMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useListPools = (
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
        queryKey: listResourcePoolsQueryKey(),
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
        queryKey: listResourcePoolsQueryKey(),
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
        queryKey: listResourcePoolsQueryKey(),
      });
    },
  });
};
