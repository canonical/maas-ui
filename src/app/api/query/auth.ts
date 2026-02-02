import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  HandleOauthCallbackResponses,
  HandleOauthCallbackErrors,
  HandleOauthCallbackData,
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
  TokenResponse,
  LoginError,
  ExtendSessionResponses,
  ExtendSessionErrors,
  ExtendSessionData,
  InitiateAuthFlowData,
  InitiateAuthFlowResponses,
  InitiateAuthFlowErrors,
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
  extendSession,
  initiateAuthFlow,
  handleOauthCallback,
} from "@/app/apiclient";
import {
  getMeWithSummaryQueryKey,
  getOauthProviderQueryKey,
  handleOauthCallbackQueryKey,
  initiateAuthFlowQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";
import { INCORRECT_CREDENTIALS_ERROR_MESSAGE } from "@/app/login/Login/Login";
import { statusActions } from "@/app/store/status";
import { setCookie } from "@/app/utils";
import { COOKIE_NAMES } from "@/app/utils/cookies";

export const usePreLogin = (mutationOptions?: Options<PreLoginData>) => {
  return useMutation({
    ...mutationOptionsWithHeaders<
      PreLoginResponses,
      PreLoginErrors,
      PreLoginData
    >(mutationOptions, preLogin),
  });
};

export const useIsOIDCUser = (
  options: Options<InitiateAuthFlowData>,
  enabled: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      InitiateAuthFlowResponses,
      InitiateAuthFlowErrors,
      InitiateAuthFlowData
    >(options, initiateAuthFlow, initiateAuthFlowQueryKey(options)),
    enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useGetCallback = (
  options: Options<HandleOauthCallbackData>,
  enabled: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      HandleOauthCallbackResponses,
      HandleOauthCallbackErrors,
      HandleOauthCallbackData
    >(options, handleOauthCallback, handleOauthCallbackQueryKey(options)),
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
  });
};

export const useAuthenticate = (mutationOptions?: Options<LoginData>) => {
  const dispatch = useDispatch();
  const createSession = useCreateSession();
  return useMutation({
    ...mutationOptionsWithHeaders<LoginResponses, LoginErrors, LoginData>(
      mutationOptions,
      login
    ),
    onSuccess: async (data: TokenResponse) => {
      setCookie(COOKIE_NAMES.LOCAL_JWT_TOKEN_NAME, data.access_token, {
        sameSite: "Strict",
        path: "/",
      });
      setCookie(COOKIE_NAMES.LOCAL_REFRESH_TOKEN_NAME, data.refresh_token!, {
        sameSite: "Strict",
        path: "/",
      });
      await createSession.mutateAsync({});
      dispatch(statusActions.loginSuccess());
    },
    onError: (error: LoginError) => {
      if (error.code === 401) {
        dispatch(statusActions.loginError(INCORRECT_CREDENTIALS_ERROR_MESSAGE));
      }
    },
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

export const useExtendSession = (
  mutationOptions?: Options<ExtendSessionData>
) => {
  return useMutation({
    ...mutationOptionsWithHeaders<
      ExtendSessionResponses,
      ExtendSessionErrors,
      ExtendSessionData
    >(mutationOptions, extendSession),
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
