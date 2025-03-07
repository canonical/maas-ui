import { useCreatePool, useDeletePool, useUpdatePool } from "./pools";

import type { ResourcePoolRequest } from "@/app/apiclient";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  poolsResolvers.createPool.handler(),
  poolsResolvers.updatePool.handler(),
  poolsResolvers.deletePool.handler()
);

describe("useCreatePool", () => {
  it("should create a new pool", async () => {
    const newPool: ResourcePoolRequest = {
      name: "newPool",
      description: "newPoolDescription",
    };
    const { result } = renderHookWithProviders(() => useCreatePool());
    result.current.mutate({ body: newPool });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useUpdatePool", () => {
  it("should update a new pool", async () => {
    const newPool: ResourcePoolRequest = {
      name: "updatedPool",
      description: "updatedPoolDescription",
    };
    const { result } = renderHookWithProviders(() => useUpdatePool());
    result.current.mutate({ body: newPool, path: { resource_pool_id: 1 } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeletePool", () => {
  it("should delete a pool", async () => {
    const { result } = renderHookWithProviders(() => useDeletePool());
    result.current.mutate({ path: { resource_pool_id: 1 } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
