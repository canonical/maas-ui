import { http, HttpResponse } from "msw";

import { powerTypeV3 } from "../factories";
import { BASE_URL } from "../utils";

import type {
  ListPowerTypesError,
  ListPowerTypesResponse,
} from "@/app/apiclient";

const mockPowerTypes: ListPowerTypesResponse = {
  items: [
    powerTypeV3({
      name: "manual",
      description: "Manual",
      driver_type: "power",
    }),
    powerTypeV3({
      name: "amt",
      description: "Intel AMT",
      driver_type: "power",
    }),
    powerTypeV3({
      name: "apc",
      description:
        "American Power Conversion (APC) Power Distribution Unit (PDU)",
      driver_type: "power",
    }),
    powerTypeV3({
      name: "lxd",
      description: "LXD",
      driver_type: "power",
    }),
  ],
};

const mockListPowerTypesError: ListPowerTypesError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // This will always be 'Error' for every error response
};

const powerTypesResolvers = {
  listPowerTypes: {
    resolved: false,
    handler: (data: ListPowerTypesResponse = mockPowerTypes) =>
      http.get(`${BASE_URL}MAAS/a/v3/power-types`, () => {
        powerTypesResolvers.listPowerTypes.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListPowerTypesError = mockListPowerTypesError) =>
      http.get(`${BASE_URL}MAAS/a/v3/power-types`, () => {
        powerTypesResolvers.listPowerTypes.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { powerTypesResolvers, mockPowerTypes };
