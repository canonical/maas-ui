import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import { queryOptionsWithHeaders } from "@/app/api/utils";
import type {
  CreateSshHostKeyData,
  CreateSshHostKeyError,
  CreateSshHostKeyResponse,
  DeleteSshHostKeyData,
  DeleteSshHostKeyError,
  DeleteSshHostKeyResponse,
  ListSshHostKeysData,
  ListSshHostKeysErrors,
  ListSshHostKeysResponses,
  Options,
} from "@/app/apiclient";
import { listSshHostKeys } from "@/app/apiclient";
import {
  createSshHostKeyMutation,
  deleteSshHostKeyMutation,
  listSshHostKeysQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useTrustedSshHostKeys = (
  options?: Options<ListSshHostKeysData>
) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListSshHostKeysResponses,
      ListSshHostKeysErrors,
      ListSshHostKeysData
    >(options, listSshHostKeys, listSshHostKeysQueryKey(options))
  );
};

export const useCreateTrustedSshHostKey = (
  mutationOptions?: Options<CreateSshHostKeyData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateSshHostKeyResponse,
    CreateSshHostKeyError,
    Options<CreateSshHostKeyData>
  >({
    ...createSshHostKeyMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listSshHostKeysQueryKey(),
      });
    },
  });
};

export const useDeleteTrustedSshHostKey = (
  mutationOptions?: Options<DeleteSshHostKeyData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteSshHostKeyResponse,
    DeleteSshHostKeyError,
    Options<DeleteSshHostKeyData>
  >({
    ...deleteSshHostKeyMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listSshHostKeysQueryKey(),
      });
    },
  });
};
