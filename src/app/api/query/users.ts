import type { Options } from "@hey-api/client-fetch";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type {
  ChangePasswordUserData,
  ChangePasswordUserError,
  ChangePasswordUserResponse,
  CompleteIntroData,
  CompleteIntroError,
  CompleteIntroResponse,
  CreateUserData,
  CreateUserError,
  CreateUserResponse,
  DeleteUserData,
  DeleteUserError,
  DeleteUserResponse,
  GetMeWithSummaryData,
  GetMeWithSummaryError,
  GetMeWithSummaryResponse,
  GetUserData,
  GetUserError,
  GetUserResponse,
  ListUsersWithSummaryData,
  ListUsersWithSummaryError,
  ListUsersWithSummaryResponse,
  UpdateUserData,
  UpdateUserError,
  UpdateUserResponse,
} from "@/app/apiclient";
import {
  changePasswordUserMutation,
  completeIntroMutation,
  createUserMutation,
  deleteUserMutation,
  getMeWithSummaryOptions,
  getMeWithSummaryQueryKey,
  getUserOptions,
  listUsersWithSummaryOptions,
  listUsersWithSummaryQueryKey,
  updateUserMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useUsers = (options?: Options<ListUsersWithSummaryData>) => {
  return useWebsocketAwareQuery(
    listUsersWithSummaryOptions(options) as UseQueryOptions<
      ListUsersWithSummaryResponse,
      ListUsersWithSummaryError,
      ListUsersWithSummaryResponse
    >
  );
};

export const useUserCount = (options?: Options<ListUsersWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...listUsersWithSummaryOptions(options),
    select: (data) => data?.total ?? 0,
  } as UseQueryOptions<
    ListUsersWithSummaryResponse,
    ListUsersWithSummaryResponse,
    number
  >);
};

export const useGetThisUser = (options?: Options<GetMeWithSummaryData>) => {
  return useWebsocketAwareQuery(
    getMeWithSummaryOptions(options) as UseQueryOptions<
      GetMeWithSummaryResponse,
      GetMeWithSummaryError,
      GetMeWithSummaryResponse
    >
  );
};

export const useGetUser = (options: Options<GetUserData>) => {
  return useWebsocketAwareQuery(
    getUserOptions(options) as UseQueryOptions<
      GetUserResponse,
      GetUserError,
      GetUserResponse
    >
  );
};

export const useCompleteIntro = (
  mutationOptions?: Options<CompleteIntroData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CompleteIntroResponse,
    CompleteIntroError,
    Options<CompleteIntroData>
  >({
    ...completeIntroMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};

export const useChangeThisUsersPassword = (
  mutationOptions?: Options<ChangePasswordUserData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ChangePasswordUserResponse,
    ChangePasswordUserError,
    Options<ChangePasswordUserData>
  >({
    ...changePasswordUserMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getMeWithSummaryQueryKey(),
      });
    },
  });
};

export const useCreateUser = (mutationOptions?: Options<CreateUserData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateUserResponse,
    CreateUserError,
    Options<CreateUserData>
  >({
    ...createUserMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};

export const useUpdateUser = (mutationOptions?: Options<UpdateUserData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateUserResponse,
    UpdateUserError,
    Options<UpdateUserData>
  >({
    ...updateUserMutation(mutationOptions),
    onSuccess: async () => {
      void queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};

export const useDeleteUser = (mutationOptions?: Options<DeleteUserData>) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteUserResponse,
    DeleteUserError,
    Options<DeleteUserData>
  >({
    ...deleteUserMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listUsersWithSummaryQueryKey(),
      });
    },
  });
};
