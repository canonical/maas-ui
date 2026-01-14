import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  CompleteIntroData,
  CompleteIntroErrors,
  CompleteIntroResponses,
  CreateOauthProviderData,
  CreateOauthProviderErrors,
  CreateOauthProviderResponses,
  CreateSessionData,
  CreateSessionErrors,
  CreateSessionResponses,
  DeleteOauthProviderData,
  DeleteOauthProviderErrors,
  DeleteOauthProviderResponses,
  GetMeWithSummaryData,
  GetMeWithSummaryErrors,
  GetMeWithSummaryResponses,
  GetOauthProviderData,
  GetOauthProviderErrors,
  GetOauthProviderResponses,
  LoginData,
  LoginErrors,
  LoginResponses,
  Options,
  UpdateOauthProviderData,
  UpdateOauthProviderErrors,
  UpdateOauthProviderResponses,
  PreLoginData,
  PreLoginResponses,
  PreLoginErrors,
} from "@/app/apiclient";
import {
  deleteOauthProvider,
  updateOauthProvider,
  createOauthProvider,
  completeIntro,
  getOauthProvider,
  getMeWithSummary,
  login,
  createSession,
  preLogin,
} from "@/app/apiclient";
import {
  getMeWithSummaryQueryKey,
  getOauthProviderQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const usePreLogin = (mutationOptions?: Options<PreLoginData>) => {
  return useMutation({
    ...mutationOptionsWithHeaders<
      PreLoginResponses,
      PreLoginErrors,
      PreLoginData
    >(mutationOptions, preLogin),
  });
};

export const useAuthenticate = (mutationOptions?: Options<LoginData>) => {
  return useMutation({
    ...mutationOptionsWithHeaders<LoginResponses, LoginErrors, LoginData>(
      mutationOptions,
      login
    ),
  });
};

export const useCreateSession = (
  mutationOtions?: Options<CreateSessionData>
) => {
  return useMutation({
    ...mutationOptionsWithHeaders<
      CreateSessionResponses,
      CreateSessionErrors,
      CreateSessionData
    >(mutationOtions, createSession),
  });
};

export const useGetCurrentUser = (options?: Options<GetMeWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      GetMeWithSummaryResponses,
      GetMeWithSummaryErrors,
      GetMeWithSummaryData
    >(options, getMeWithSummary, getMeWithSummaryQueryKey(options)),
    retry: false, // explicitly set retry to false
  });
};

export const useGetIsSuperUser = (options?: Options<GetMeWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      GetMeWithSummaryResponses,
      GetMeWithSummaryErrors,
      GetMeWithSummaryData
    >(options, getMeWithSummary, getMeWithSummaryQueryKey(options)),
    select: (data) => data.is_superuser,
  });
};

export const useCompleteIntro = (
  mutationOptions?: Options<CompleteIntroData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      CompleteIntroResponses,
      CompleteIntroErrors,
      CompleteIntroData
    >(mutationOptions, completeIntro),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getMeWithSummaryQueryKey(),
      });
    },
  });
};

export const useActiveOauthProvider = (
  options?: Options<GetOauthProviderData>
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      GetOauthProviderResponses,
      GetOauthProviderErrors,
      GetOauthProviderData
    >(options, getOauthProvider, getOauthProviderQueryKey(options)),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useCreateOauthProvider = (
  mutationOptions?: Options<CreateOauthProviderData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      CreateOauthProviderResponses,
      CreateOauthProviderErrors,
      CreateOauthProviderData
    >(mutationOptions, createOauthProvider),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getOauthProviderQueryKey(),
      });
    },
  });
};

export const useUpdateOauthProvider = (
  mutationOptions?: Options<UpdateOauthProviderData>
) => {
  return useMutation({
    ...mutationOptionsWithHeaders<
      UpdateOauthProviderResponses,
      UpdateOauthProviderErrors,
      UpdateOauthProviderData
    >(mutationOptions, updateOauthProvider),
  });
};

export const useDeleteOauthProvider = (
  mutationOptions?: Options<DeleteOauthProviderData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      DeleteOauthProviderResponses,
      DeleteOauthProviderErrors,
      DeleteOauthProviderData
    >(mutationOptions, deleteOauthProvider),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getOauthProviderQueryKey(),
      });
    },
  });
};
