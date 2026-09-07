import { http, HttpResponse } from "msw";

import { sshHostKey as sshHostKeyFactory } from "../factories";
import { BASE_URL } from "../utils";

import type {
  CreateSshHostKeyError,
  DeleteSshHostKeyError,
  ListSshHostKeysError,
  ListSshHostKeysResponse,
} from "@/app/apiclient";

const mockSshHostKeys: ListSshHostKeysResponse = {
  items: [
    sshHostKeyFactory({ id: 1 }),
    sshHostKeyFactory({ id: 2 }),
    sshHostKeyFactory({ id: 3 }),
  ],
  total: 3,
};

const mockListSshHostKeysError: ListSshHostKeysError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error",
};

const mockCreateSshHostKeyError: CreateSshHostKeyError = {
  message: "Unprocessable entity",
  code: 422,
  kind: "Error",
};

const mockDeleteSshHostKeyError: DeleteSshHostKeyError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const sshHostKeysResolvers = {
  listSshHostKeys: {
    resolved: false,
    handler: (data: ListSshHostKeysResponse = mockSshHostKeys) =>
      http.get(`${BASE_URL}MAAS/a/v3/ssh-host-keys`, () => {
        sshHostKeysResolvers.listSshHostKeys.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListSshHostKeysError = mockListSshHostKeysError) =>
      http.get(`${BASE_URL}MAAS/a/v3/ssh-host-keys`, () => {
        sshHostKeysResolvers.listSshHostKeys.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createSshHostKey: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/ssh-host-keys`, () => {
        sshHostKeysResolvers.createSshHostKey.resolved = true;
        return HttpResponse.json(sshHostKeyFactory({ id: 4 }), {
          status: 201,
        });
      }),
    error: (error: CreateSshHostKeyError = mockCreateSshHostKeyError) =>
      http.post(`${BASE_URL}MAAS/a/v3/ssh-host-keys`, () => {
        sshHostKeysResolvers.createSshHostKey.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  deleteSshHostKey: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/ssh-host-keys/:id`, () => {
        sshHostKeysResolvers.deleteSshHostKey.resolved = true;
        return HttpResponse.json({}, { status: 204 });
      }),
    error: (error: DeleteSshHostKeyError = mockDeleteSshHostKeyError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/ssh-host-keys/:id`, () => {
        sshHostKeysResolvers.deleteSshHostKey.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { mockSshHostKeys, sshHostKeysResolvers };
