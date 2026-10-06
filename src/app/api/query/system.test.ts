import { useSystemInfo } from "./system";

import { mockSystemInfo, systemResolvers } from "@/testing/resolvers/system";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(systemResolvers.getSystemInfo.handler());

describe("useSystemInfo", () => {
  it("should return system info data", async () => {
    const { result } = renderHookWithProviders(() => useSystemInfo());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockSystemInfo);
  });
});
