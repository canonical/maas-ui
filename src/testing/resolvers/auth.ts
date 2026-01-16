import { http, HttpResponse } from "msw";

import { oAuthProviderFactory } from "../factories/auth";
import { BASE_URL } from "../utils";

import type {
  PreLoginResponse,
  PreLoginError,
  CreateSessionError,
  LoginResponse,
  CompleteIntroError,
  CreateOauthProviderError,
  GetMeWithSummaryError,
  GetOauthProviderError,
  LoginError,
  OAuthProviderResponse,
  UpdateOauthProviderError,
  UpdateUserError,
  UserWithSummaryResponse,
} from "@/app/apiclient";
import { user } from "@/testing/factories";

const mockAuth: UserWithSummaryResponse = user({
  id: 1,
  email: "user1@example.com",
  username: "user1",
});

const mockPreLoginResponse: PreLoginResponse = {
  is_authenticated: false,
  no_users: false,
  kind: "PreLoginResponse",
};

const mockPreLoginError: PreLoginError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const mockCreateSessionError: CreateSessionError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const mockLoginResponse: LoginResponse = {
  token_type: "Bearer",
  access_token: "mock_access_token",
  kind: "AccessTokenResponse",
};

const mockAuthenticateError: LoginError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // This will always be 'Error' for every error response
};

const mockCompleteIntroError: CompleteIntroError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

export const mockOauthProvider: OAuthProviderResponse =
  oAuthProviderFactory.build();

const mockGetOauthProviderError: GetOauthProviderError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const mockCreateOauthProviderError: CreateOauthProviderError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const mockupdateOauthProviderError: UpdateOauthProviderError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const mockDeleteOauthProviderError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const authResolvers = {
  authenticate: {
    resolved: false,
    handler: (data: LoginResponse = mockLoginResponse) =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/login`, () => {
        authResolvers.authenticate.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: LoginError = mockAuthenticateError) =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/login`, () => {
        authResolvers.authenticate.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  preLogin: {
    resolved: false,
    handler: (data: PreLoginResponse = mockPreLoginResponse) =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/prelogin`, () => {
        authResolvers.preLogin.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: PreLoginError = mockPreLoginError) =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/prelogin`, () => {
        authResolvers.preLogin.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createSession: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/sessions`, () => {
        authResolvers.createSession.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: CreateSessionError = mockCreateSessionError) =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/sessions`, () => {
        authResolvers.createSession.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  getCurrentUser: {
    resolved: false,
    handler: (data = mockAuth) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me_with_summary`, () => {
        authResolvers.getCurrentUser.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: GetMeWithSummaryError = mockAuthenticateError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me_with_summary`, () => {
        authResolvers.getCurrentUser.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  completeIntro: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/users/me:complete_intro`, () => {
        authResolvers.completeIntro.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: UpdateUserError = mockCompleteIntroError) =>
      http.post(`${BASE_URL}MAAS/a/v3/users/me:complete_intro`, () => {
        authResolvers.completeIntro.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  getActiveOauthProvider: {
    resolved: false,
    handler: (data = mockOauthProvider) =>
      http.get(`${BASE_URL}MAAS/a/v3/auth/oauth:is_active`, () => {
        authResolvers.getActiveOauthProvider.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error = mockGetOauthProviderError) =>
      http.get(`${BASE_URL}MAAS/a/v3/auth/oauth:is_active`, () => {
        authResolvers.getActiveOauthProvider.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createOauthProvider: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/oauth/providers`, ({ request }) => {
        authResolvers.createOauthProvider.resolved = true;
        return HttpResponse.json(request.body);
      }),
    error: (error = mockCreateOauthProviderError) =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/oauth/providers`, () => {
        authResolvers.createOauthProvider.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  updateOauthProvider: {
    resolved: false,
    handler: () =>
      http.put(
        `${BASE_URL}MAAS/a/v3/auth/oauth/providers/:id`,
        ({ request }) => {
          authResolvers.updateOauthProvider.resolved = true;
          return HttpResponse.json(request.body);
        }
      ),
    error: (error = mockupdateOauthProviderError) =>
      http.put(`${BASE_URL}MAAS/a/v3/auth/oauth/providers/:id`, () => {
        authResolvers.updateOauthProvider.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  deleteOauthProvider: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/auth/oauth/providers/:id`, () => {
        authResolvers.deleteOauthProvider.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error = mockDeleteOauthProviderError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/auth/oauth/providers/:id`, () => {
        authResolvers.deleteOauthProvider.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { authResolvers, mockAuth };
