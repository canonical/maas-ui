import { useRacks } from "./racks";

import { mockRacks, rackResolvers } from "@/testing/resolvers/racks";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(rackResolvers.listRacks.handler());

describe("useRacks", () => {
  it("should return racks data", async () => {
    const { result } = renderHookWithProviders(() => useRacks());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.items).toEqual(mockRacks.items);
  });
});
