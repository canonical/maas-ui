import { http, HttpResponse } from "msw";

import { BASE_URL } from "../utils";

import type {
  CreateResourcePoolError,
  DeleteResourcePoolError,
  UpdateResourcePoolError,
} from "@/app/apiclient";

const mockCreatePoolError: CreateResourcePoolError = {
  message: "A pool with this name already exists.",
  code: 409,
  kind: "Error",
};

const mockUpdatePoolError: UpdateResourcePoolError = {
  message: "Internal server error",
  code: 500,
  kind: "Error",
};

const mockDeletePoolError: DeleteResourcePoolError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

const poolsResolvers = {
  createPool: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/resource_pools`, () => {
        poolsResolvers.createPool.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: CreateResourcePoolError = mockCreatePoolError) =>
      http.post(`${BASE_URL}MAAS/a/v3/resource_pools`, () => {
        poolsResolvers.createPool.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  updatePool: {
    resolved: false,
    handler: () =>
      http.put(`${BASE_URL}MAAS/a/v3/resource_pools/:id`, () => {
        poolsResolvers.updatePool.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: UpdateResourcePoolError = mockUpdatePoolError) =>
      http.put(`${BASE_URL}MAAS/a/v3/resource_pools/:id`, () => {
        poolsResolvers.updatePool.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  deletePool: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/resource_pools/:id`, () => {
        poolsResolvers.deletePool.resolved = true;
        return HttpResponse.json({}, { status: 204 });
      }),
    error: (error: DeleteResourcePoolError = mockDeletePoolError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/resource_pools/:id`, () => {
        poolsResolvers.deletePool.resolved = true;
        return HttpResponse.json(error, { status: 404 });
      }),
  },
};

export { poolsResolvers };
