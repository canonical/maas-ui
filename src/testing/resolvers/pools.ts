import { http, HttpResponse } from "msw";

import { resourcePool } from "../factories";
import type { Resolver } from "../utils";
import { mockErrors, BASE_URL } from "../utils";

import type {
  BadRequestBodyResponse,
  ConflictBodyResponse,
  CreateResourcePoolError,
  DeleteResourcePoolError,
  GetUserError,
  ListResourcePoolsError,
  NotFoundBodyResponse,
  ResourcePoolsWithSummaryListResponse,
  ResourcePoolWithSummaryResponse,
  UpdateResourcePoolError,
  ValidationErrorBodyResponse,
} from "@/app/apiclient";

const mockPools: ResourcePoolsWithSummaryListResponse = {
  items: [
    resourcePool({
      name: "swimming",
      description: "place where you go to swim",
      machine_ready_count: 5,
      machine_total_count: 10,
      is_default: true,
      permissions: ["edit", "delete"],
    }),
    resourcePool({
      name: "gene",
      description: "a collection of genes",
      machine_ready_count: 1,
      machine_total_count: 2,
      is_default: false,
      permissions: [],
    }),
    resourcePool({
      name: "car",
      description: "a company car",
      machine_ready_count: 1,
      machine_total_count: 1,
      is_default: false,
      permissions: ["edit"],
    }),
  ],
  total: 3,
};

const poolsResolvers: Resolver<
  ResourcePoolWithSummaryResponse,
  | ConflictBodyResponse
  | BadRequestBodyResponse
  | NotFoundBodyResponse
  | ValidationErrorBodyResponse
> = {
  listPools: {
    resolved: false,
    handler: (data = mockPools) =>
      http.get(`${BASE_URL}MAAS/a/v3/resource_pools_with_summary`, () => {
        poolsResolvers.listPools.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListResourcePoolsError = mockErrors.listError) =>
      http.get(`${BASE_URL}MAAS/a/v3/resource_pools_with_summary`, () => {
        poolsResolvers.listPools.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  getPool: {
    resolved: false,
    handler: () =>
      http.get(`${BASE_URL}MAAS/a/v3/resource_pools/:id`, ({ params }) => {
        const id = Number(params.id);
        if (!id) return HttpResponse.error();

        const pool = mockPools.items.find((pool) => pool.id === id);
        poolsResolvers.getPool.resolved = true;
        return pool ? HttpResponse.json(pool) : HttpResponse.error();
      }),
    error: (error: GetUserError = mockErrors.getError) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/:id`, () => {
        poolsResolvers.getPool.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createPool: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/resource_pools`, () => {
        poolsResolvers.createPool.resolved = true;
        return HttpResponse.json({ id: 1 });
      }),
    error: (error: CreateResourcePoolError = mockErrors.createError) =>
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
    error: (error: UpdateResourcePoolError = mockErrors.updateError) =>
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
    error: (error: DeleteResourcePoolError = mockErrors.deleteError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/resource_pools/:id`, () => {
        poolsResolvers.deletePool.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { poolsResolvers, mockPools };
