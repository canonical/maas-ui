import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  CreateUserData,
  CreateUserErrors,
  CreateUserResponses,
  DeleteUserData,
  DeleteUserErrors,
  DeleteUserResponses,
  GetUserData,
  GetUserErrors,
  GetUserResponses,
  ListUsersWithSummaryData,
  ListUsersWithSummaryErrors,
  ListUsersWithSummaryResponses,
  Options,
  UpdateUserData,
  UpdateUserErrors,
  UpdateUserResponses,
} from "@/app/apiclient";
import {
  deleteUser,
  updateUser,
  createUser,
  getUser,
  listUsersWithSummary,
} from "@/app/apiclient";
import {
  getUserQueryKey,
  listUsersWithSummaryQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useUsers = (options?: Options<ListUsersWithSummaryData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListUsersWithSummaryResponses,
      ListUsersWithSummaryErrors,
      ListUsersWithSummaryData
    >(options, listUsersWithSummary, listUsersWithSummaryQueryKey(options))
  );
};

export const useUserCount = (options?: Options<ListUsersWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      ListUsersWithSummaryResponses,
      ListUsersWithSummaryErrors,
      ListUsersWithSummaryData
    >(options, listUsersWithSummary, listUsersWithSummaryQueryKey(options)),
    select: (data) => data?.total ?? 0,
  });
};

export const useGetUser = (options: Options<GetUserData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<GetUserResponses, GetUserErrors, GetUserData>(
      options,
      getUser,
      getUserQueryKey(options)
    )
  );
};

export const useCreateUser = (mutationOptions?: Options<CreateUserData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      CreateUserResponses,
      CreateUserErrors,
      CreateUserData
    >(mutationOptions, createUser),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};

export const useUpdateUser = (mutationOptions?: Options<UpdateUserData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      UpdateUserResponses,
      UpdateUserErrors,
      UpdateUserData
    >(mutationOptions, updateUser),
    onSuccess: async () => {
      return queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};

export const useDeleteUser = (mutationOptions?: Options<DeleteUserData>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      DeleteUserResponses,
      DeleteUserErrors,
      DeleteUserData
    >(mutationOptions, deleteUser),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};
