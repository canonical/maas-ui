import { http, HttpResponse } from "msw";

import { BASE_URL } from "../utils";

import type {
  CompleteIntroError,
  GetMeWithSummaryError,
  LoginError,
  UpdateUserError,
  UserWithSummaryResponse,
} from "@/app/apiclient";
import { user } from "@/testing/factories";

const mockAuth: UserWithSummaryResponse = user({
  id: 1,
  email: "user1@example.com",
  username: "user1",
});

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

const authResolvers = {
  authenticate: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/login`, () => {
        authResolvers.authenticate.resolved = true;
        return HttpResponse.json();
      }),
    error: (error: LoginError = mockAuthenticateError) =>
      http.post(`${BASE_URL}MAAS/a/v3/auth/login`, () => {
        authResolvers.authenticate.resolved = true;
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
};

export { authResolvers, mockAuth };
