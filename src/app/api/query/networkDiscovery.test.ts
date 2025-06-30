import { useNetworkDiscoveries } from "@/app/api/query/networkDiscovery";
import {
  mockNetworkDiscoveries,
  networkDiscoveryResolvers,
} from "@/testing/resolvers/networkDiscovery";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(networkDiscoveryResolvers.listNetworkDiscoveries.handler());

describe("useNetworkDiscoveries", () => {
  it("should return network discovery data", async () => {
    const { result } = renderHookWithProviders(() => useNetworkDiscoveries());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockNetworkDiscoveries);
  });
});
