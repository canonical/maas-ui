import type { Options } from "@hey-api/client-fetch";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type {
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
  LoginData,
  LoginError,
  LoginResponse,
  UpdateUserData,
  UpdateUserError,
  UpdateUserResponse,
} from "@/app/apiclient";
import {
  completeIntroMutation,
  createUserMutation,
  deleteUserMutation,
  getMeWithSummaryOptions,
  getUserOptions,
  listUsersWithSummaryOptions,
  listUsersWithSummaryQueryKey,
  loginMutation,
  updateUserMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useLogin = (mutationOptions?: Options<LoginData>) => {
  return useMutation<LoginResponse, LoginError, Options<LoginData>>({
    ...loginMutation(mutationOptions),
  });
};

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

export const useGetIsSuperUser = (options?: Options<GetMeWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...getMeWithSummaryOptions(options),
    select: (data) => data.is_superuser,
  } as UseQueryOptions<
    GetMeWithSummaryResponse,
    GetMeWithSummaryError,
    boolean
  >);
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
