import type { Options } from "@hey-api/client-fetch";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
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
  ValidationErrorBodyResponse,
  SshKeysListResponse,
} from "@/app/apiclient";
import {
  createUserSshkeysMutation,
  deleteUserSshkeyMutation,
  importUserSshkeysMutation,
  listUserSshkeysOptions,
  listUserSshkeysQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useListSshKeys = (
  options?: Options<ListUserSshkeysData>
): UseQueryResult<SshKeysListResponse, ValidationErrorBodyResponse> => {
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
): UseMutationResult<
  CreateUserSshkeysResponse,
  CreateUserSshkeysError,
  Options<CreateUserSshkeysData>
> => {
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
): UseMutationResult<
  SshKeysListResponse,
  ImportUserSshkeysError,
  Options<ImportUserSshkeysData>
> => {
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

export const useDeleteSshKey = (
  mutationOptions?: Options<DeleteUserSshkeyData>
): UseMutationResult<
  DeleteUserSshkeyResponse,
  DeleteUserSshkeyError,
  Options<DeleteUserSshkeyData>
> => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteUserSshkeyResponse,
    DeleteUserSshkeyError,
    Options<DeleteUserSshkeyData>
  >({
    ...deleteUserSshkeyMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listUserSshkeysQueryKey(),
      });
    },
  });
};
