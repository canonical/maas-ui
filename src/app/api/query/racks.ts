import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  CreateRackData,
  CreateRackErrors,
  CreateRackResponses,
  DeleteRacksData,
  DeleteRacksErrors,
  DeleteRacksResponses,
  GenerateRackBootstrapTokenData,
  GenerateRackBootstrapTokenErrors,
  GenerateRackBootstrapTokenResponses,
  GetRackData,
  GetRackErrors,
  GetRackResponses,
  ListRacksData,
  ListRacksErrors,
  ListRacksResponses,
  Options,
  UpdateRackData,
  UpdateRackErrors,
  UpdateRackResponses,
} from "@/app/apiclient";
import {
  createRack,
  deleteRacks,
  generateRackBootstrapToken,
  updateRack,
  getRack,
  listRacks,
} from "@/app/apiclient";
import {
  getRackQueryKey,
  listRacksQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useRacks = (options?: Options<ListRacksData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<ListRacksResponses, ListRacksErrors, ListRacksData>(
      options,
      listRacks,
      listRacksQueryKey(options)
    )
  );
};

export const useGetRack = (options: Options<GetRackData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<GetRackResponses, GetRackErrors, GetRackData>(
      options,
      getRack,
      getRackQueryKey(options)
    )
  );
};

export const useCreateRack = (mutationOptions?: Options<CreateRackData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      CreateRackResponses,
      CreateRackErrors,
      CreateRackData
    >(mutationOptions, createRack),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listRacksQueryKey(),
      });
    },
  });
};

export const useUpdateRack = (mutationOptions?: Options<UpdateRackData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      UpdateRackResponses,
      UpdateRackErrors,
      UpdateRackData
    >(mutationOptions, updateRack),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listRacksQueryKey(),
      });
    },
  });
};

export const useDeleteRack = (mutationOptions?: Options<DeleteRacksData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      DeleteRacksResponses,
      DeleteRacksErrors,
      DeleteRacksData
    >(mutationOptions, deleteRacks),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listRacksQueryKey(),
      });
    },
  });
};

export const useGenerateToken = (
  mutationOptions?: Options<GenerateRackBootstrapTokenData>
) => {
  return useMutation({
    ...mutationOptionsWithHeaders<
      GenerateRackBootstrapTokenResponses,
      GenerateRackBootstrapTokenErrors,
      GenerateRackBootstrapTokenData
    >(mutationOptions, generateRackBootstrapToken),
  });
};
