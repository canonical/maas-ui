import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type {
  CompleteIntroData,
  CompleteIntroError,
  CompleteIntroResponse,
  CreateOauthProviderData,
  CreateOauthProviderError,
  CreateOauthProviderResponse,
  GetMeWithSummaryData,
  GetMeWithSummaryError,
  GetMeWithSummaryResponse,
  GetOauthProviderData,
  GetOauthProviderError,
  GetOauthProviderResponse,
  LoginData,
  LoginError,
  LoginResponse,
  Options,
  UpdateOauthProviderData,
  UpdateOauthProviderError,
  UpdateOauthProviderResponse,
} from "@/app/apiclient";
import {
  completeIntroMutation,
  createOauthProviderMutation,
  getMeWithSummaryOptions,
  getMeWithSummaryQueryKey,
  getOauthProviderOptions,
  getOauthProviderQueryKey,
  loginMutation,
  updateOauthProviderMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useAuthenticate = (mutationOptions?: Options<LoginData>) => {
  return useMutation<LoginResponse, LoginError, Options<LoginData>>({
    ...loginMutation(mutationOptions),
  });
};

export const useGetCurrentUser = (
  options?: Options<GetMeWithSummaryData>,
  queryOptions?: UseQueryOptions<
    GetMeWithSummaryData,
    GetMeWithSummaryError,
    GetMeWithSummaryResponse
  >
) => {
  return useWebsocketAwareQuery({
    ...(getMeWithSummaryOptions(options) as UseQueryOptions<
      GetMeWithSummaryData,
      GetMeWithSummaryError,
      GetMeWithSummaryResponse
    >),
    ...queryOptions,
  });
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
      return queryClient.invalidateQueries({
        queryKey: getMeWithSummaryQueryKey(),
      });
    },
  });
};

export const useActiveOauthProvider = (
  options?: Options<GetOauthProviderData>,
  queryOptions?: UseQueryOptions<
    GetOauthProviderData,
    GetOauthProviderError,
    GetOauthProviderResponse
  >
) => {
  return useWebsocketAwareQuery({
    ...(getOauthProviderOptions(options) as UseQueryOptions<
      GetOauthProviderData,
      GetOauthProviderError,
      GetOauthProviderResponse
    >),
    ...queryOptions,
  });
};

export const useCreateOauthProvider = (
  mutationOptions?: Options<CreateOauthProviderData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateOauthProviderResponse,
    CreateOauthProviderError,
    Options<CreateOauthProviderData>
  >({
    ...createOauthProviderMutation(mutationOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getOauthProviderQueryKey() });
    },
  });
};

export const useUpdateOauthProvider = (
  mutationOptions?: Options<UpdateOauthProviderData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateOauthProviderResponse,
    UpdateOauthProviderError,
    Options<UpdateOauthProviderData>
  >({
    ...updateOauthProviderMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getOauthProviderQueryKey(),
      });
    },
  });
};
