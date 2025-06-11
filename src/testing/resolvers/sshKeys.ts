import { http, HttpResponse } from "msw";

import type { Resolver } from "../utils";
import { BASE_URL, mockErrors } from "../utils";

import type {
  ConflictBodyResponse,
  CreateUserSshkeysError,
  DeleteUserSshkeyError,
  ImportUserSshkeysError,
  ListUserSshkeysError,
  ListUserSshkeysResponse,
  PreconditionFailedBodyResponse,
  SshKeyResponse,
  UnauthorizedBodyResponse,
  ValidationErrorBodyResponse,
} from "@/app/apiclient";
import { sshKey as sshKeyFactory } from "@/testing/factories";

const mockSshKeys: ListUserSshkeysResponse = {
  items: [
    sshKeyFactory({
      id: 1,
      protocol: "lp",
      auth_id: "test auth id",
      kind: "sshkey",
      key: "test key",
    }),
    sshKeyFactory({
      id: 2,
      protocol: undefined,
      auth_id: undefined,
      kind: "sshkey",
      key: "test key 2",
    }),
    sshKeyFactory({
      id: 3,
      protocol: "gh",
      auth_id: "another test auth id",
      kind: "sshkey",
      key: "test key 3",
    }),
  ],
  total: 3,
};

const mockImportSshKeysError: ImportUserSshkeysError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const sshKeyResolvers: Resolver<
  SshKeyResponse,
  | ConflictBodyResponse
  | UnauthorizedBodyResponse
  | PreconditionFailedBodyResponse
  | ValidationErrorBodyResponse
> = {
  listSshKeys: {
    resolved: false,
    handler: (data = mockSshKeys) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me/sshkeys`, () => {
        sshKeyResolvers.listSshKeys.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListUserSshkeysError = mockErrors.listError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me/sshkeys`, () => {
        sshKeyResolvers.listSshKeys.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createSshKey: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/users/me/sshkeys`, () => {
        sshKeyResolvers.createSshKey.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: CreateUserSshkeysError = mockErrors.createError) =>
      http.post(`${BASE_URL}MAAS/a/v3/users/me/sshkeys`, () => {
        sshKeyResolvers.createSshKey.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  importSshKey: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/users/me/sshkeys:import`, () => {
        sshKeyResolvers.importSshKey.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: ImportUserSshkeysError = mockImportSshKeysError) =>
      http.post(`${BASE_URL}MAAS/a/v3/users/me/sshkeys:import`, () => {
        sshKeyResolvers.importSshKey.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  deleteSshKey: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/users/me/sshkeys/:id`, () => {
        sshKeyResolvers.deleteSshKey.resolved = true;
        return HttpResponse.json({}, { status: 204 });
      }),
    error: (error: DeleteUserSshkeyError = mockErrors.deleteError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/users/me/sshkeys/:id`, () => {
        sshKeyResolvers.deleteSshKey.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { sshKeyResolvers, mockSshKeys };
