import { http, HttpResponse } from "msw";

import { BASE_URL } from "../utils";

import type {
  GetSystemInfoError,
  GetSystemInfoResponse,
  SystemInfoResponse,
} from "@/app/apiclient";
import { systemInfo as systemInfoFactory } from "@/testing/factories";

const mockSystemInfo: SystemInfoResponse = systemInfoFactory();

const mockSystemInfoError: GetSystemInfoError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error",
};

const systemResolvers = {
  getSystemInfo: {
    resolved: false,
    handler: (data: GetSystemInfoResponse = mockSystemInfo) =>
      http.get(`${BASE_URL}MAAS/a/v3/system/info`, () => {
        systemResolvers.getSystemInfo.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: GetSystemInfoError = mockSystemInfoError) =>
      http.get(`${BASE_URL}MAAS/a/v3/system/info`, () => {
        systemResolvers.getSystemInfo.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { systemResolvers, mockSystemInfo };
