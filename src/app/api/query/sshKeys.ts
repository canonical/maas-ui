import type { Options } from "@hey-api/client-fetch";
import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  CreateUserSshkeysError,
  CreateUserSshkeysResponse,
  ImportUserSshkeysData,
  ImportUserSshkeysError,
  ImportUserSshkeysResponse,
  CreateUserSshkeysData,
  ListUserSshkeysData,
  ListUserSshkeysError,
  ListUserSshkeysResponse,
} from "@/app/apiclient";
import {
  createUserSshkeysMutation,
  importUserSshkeysMutation,
  listUserSshkeysOptions,
  listUserSshkeysQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useListSshKeys = (options?: Options<ListUserSshkeysData>) => {
  return useWebsocketAwareQuery(
    listUserSshkeysOptions(options) as UseQueryOptions<
      ListUserSshkeysData,
      ListUserSshkeysError,
      ListUserSshkeysResponse
    >
  );
};

export const useCreateSshKeys = (
  mutationOptions?: Options<CreateUserSshkeysData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateUserSshkeysResponse,
    CreateUserSshkeysError,
    Options<CreateUserSshkeysData>
  >({
    ...createUserSshkeysMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listUserSshkeysQueryKey(),
      });
    },
  });
};

export const useImportSshKeys = (
  mutationOptions?: Options<ImportUserSshkeysData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ImportUserSshkeysResponse,
    ImportUserSshkeysError,
    Options<ImportUserSshkeysData>
  >({
    ...importUserSshkeysMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listUserSshkeysQueryKey(),
      });
    },
  });
};
