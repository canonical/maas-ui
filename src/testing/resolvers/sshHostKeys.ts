import { http, HttpResponse } from "msw";

import { sshHostKey as sshHostKeyFactory } from "../factories";
import { BASE_URL } from "../utils";

import type {
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
};

export { mockSshHostKeys, sshHostKeysResolvers };
