import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  CreateSshHostKeyData,
  CreateSshHostKeyError,
  CreateSshHostKeyResponse,
  DeleteSshHostKeyData,
  DeleteSshHostKeyError,
  DeleteSshHostKeyResponse,
  ListSshHostKeysData,
  ListSshHostKeysError,
  ListSshHostKeysResponse,
  Options,
} from "@/app/apiclient";
import {
  createSshHostKeyMutation,
  deleteSshHostKeyMutation,
  listSshHostKeysOptions,
  listSshHostKeysQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useTrustedSshHostKeys = (
  options?: Options<ListSshHostKeysData>
) => {
  return useWebsocketAwareQuery(
    listSshHostKeysOptions(options) as UseQueryOptions<
      ListSshHostKeysData,
      ListSshHostKeysError,
      ListSshHostKeysResponse
    >
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
