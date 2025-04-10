import { random } from "cooky-cutter";
import { http, HttpResponse } from "msw";

import { sslKey } from "../factories";
import { BASE_URL } from "../utils";

import type {
  CreateUserSslkeyError,
  GetUserSslkeysError,
  GetUserSslkeysResponse,
} from "@/app/apiclient";

const mockSslKeys: GetUserSslkeysResponse = {
  items: [
    sslKey({
      id: 1,
      key: "test key",
      user: random,
    }),
    sslKey({
      id: 2,
      key: "test key 2",
      user: random,
    }),
    sslKey({
      id: 3,
      key: "test key 3",
      user: random,
    }),
  ],
  total: 3,
};

const mockGetSslKeysError: GetUserSslkeysError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // This will always be 'Error' for every error response
};

const mockCreateSslKeysError: CreateUserSslkeyError = {
  message: "An SSL key with this fingerprint already exists.",
  code: 409,
  kind: "Error",
};

const sslKeyResolvers = {
  getSslKeys: {
    resolved: false,
    handler: (data: GetUserSslkeysResponse = mockSslKeys) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me/sslkeys`, () => {
        sslKeyResolvers.getSslKeys.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: GetUserSslkeysError = mockGetSslKeysError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me/sslkeys`, () => {
        sslKeyResolvers.getSslKeys.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createSslKey: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/users/me/sslkeys`, () => {
        sslKeyResolvers.createSslKey.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: CreateUserSslkeyError = mockCreateSslKeysError) =>
      http.post(`${BASE_URL}MAAS/a/v3/users/me/sslkeys`, () => {
        sslKeyResolvers.createSslKey.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { sslKeyResolvers, mockSslKeys };
