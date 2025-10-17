import { http, HttpResponse } from "msw";

import { rackFactory } from "../factories/racks";
import { BASE_URL } from "../utils";

import type { ListRacksError, ListRacksResponse } from "@/app/apiclient";

const mockRacks = { items: rackFactory.buildList(15), total: 15 };

const mockListRacksError: ListRacksError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // This will always be 'Error' for every error response
};

const rackResolvers = {
  listRacks: {
    resolved: false,
    handler: (data: ListRacksResponse = mockRacks) =>
      http.get(`${BASE_URL}MAAS/a/v3/racks`, () => {
        rackResolvers.listRacks.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListRacksError = mockListRacksError) =>
      http.get(`${BASE_URL}MAAS/a/v3/racks`, () => {
        rackResolvers.listRacks.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { rackResolvers, mockRacks };
