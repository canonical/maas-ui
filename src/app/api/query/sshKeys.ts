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
  DeleteUserSshkeyData,
  DeleteUserSshkeyResponse,
  DeleteUserSshkeyError,
  Options,
} from "@/app/apiclient";
import {
  createUserSshkeysMutation,
  deleteUserSshkeyMutation,
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
      return queryClient.invalidateQueries({
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
      return queryClient.invalidateQueries({
        queryKey: listUserSshkeysQueryKey(),
      });
    },
  });
};

export const useDeleteSshKey = (
  mutationOptions?: Options<DeleteUserSshkeyData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteUserSshkeyResponse,
    DeleteUserSshkeyError,
    Options<DeleteUserSshkeyData>
  >({
    ...deleteUserSshkeyMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listUserSshkeysQueryKey(),
      });
    },
  });
};
