import type { Options } from "@hey-api/client-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateResourcePoolData,
  CreateResourcePoolError,
  CreateResourcePoolResponse,
  UpdateResourcePoolData,
  UpdateResourcePoolError,
  UpdateResourcePoolResponse,
} from "@/app/apiclient";
import {
  createResourcePoolMutation,
  listResourcePoolsQueryKey,
  updateResourcePoolMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

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
