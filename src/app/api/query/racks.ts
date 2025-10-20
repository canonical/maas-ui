import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  CreateRackData,
  CreateRackError,
  CreateRackResponse,
  DeleteRacksData,
  DeleteRacksError,
  DeleteRacksResponse,
  GetRackData,
  GetRackError,
  GetRackResponse,
  ListRacksData,
  ListRacksError,
  ListRacksResponse,
  Options,
  UpdateRackData,
  UpdateRackError,
  UpdateRackResponse,
} from "@/app/apiclient";
import {
  createRackMutation,
  deleteRacksMutation,
  getRackOptions,
  listRacksInfiniteQueryKey,
  listRacksOptions,
  updateRackMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useRacks = (options?: Options<ListRacksData>) => {
  return useWebsocketAwareQuery(
    listRacksOptions(options) as UseQueryOptions<
      ListRacksData,
      ListRacksError,
      ListRacksResponse
    >
  );
};

export const useGetRack = (options: Options<GetRackData>) => {
  return useWebsocketAwareQuery(
    getRackOptions(options) as UseQueryOptions<
      GetRackData,
      GetRackError,
      GetRackResponse
    >
  );
};

export const useCreateRack = (mutationOptions?: Options<CreateRackData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateRackResponse,
    CreateRackError,
    Options<CreateRackData>
  >({
    ...createRackMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listRacksInfiniteQueryKey(),
      });
    },
  });
};

export const useUpdateRack = (mutationOptions?: Options<UpdateRackData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateRackResponse,
    UpdateRackError,
    Options<UpdateRackData>
  >({
    ...updateRackMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listRacksInfiniteQueryKey(),
      });
    },
  });
};

export const useDeleteRack = (mutationOptions?: Options<DeleteRacksData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteRacksResponse,
    DeleteRacksError,
    Options<DeleteRacksData>
  >({
    ...deleteRacksMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listRacksInfiniteQueryKey(),
      });
    },
  });
};
