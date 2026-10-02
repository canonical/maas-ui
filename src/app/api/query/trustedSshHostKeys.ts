import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  CreateSshHostKeyData,
  CreateSshHostKeyErrors,
  CreateSshHostKeyResponses,
  DeleteSshHostKeyData,
  DeleteSshHostKeyErrors,
  DeleteSshHostKeyResponses,
  ListSshHostKeysData,
  ListSshHostKeysErrors,
  ListSshHostKeysResponses,
  Options,
} from "@/app/apiclient";
import {
  createSshHostKey,
  deleteSshHostKey,
  listSshHostKeys,
} from "@/app/apiclient";
import { listSshHostKeysQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";

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
  return useMutation({
    ...mutationOptionsWithHeaders<
      CreateSshHostKeyResponses,
      CreateSshHostKeyErrors,
      CreateSshHostKeyData
    >(mutationOptions, createSshHostKey),
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
  return useMutation({
    ...mutationOptionsWithHeaders<
      DeleteSshHostKeyResponses,
      DeleteSshHostKeyErrors,
      DeleteSshHostKeyData
    >(mutationOptions, deleteSshHostKey),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listSshHostKeysQueryKey(),
      });
    },
  });
};
