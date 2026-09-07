import { usePowerTypes } from "./powerTypes";

import {
  mockPowerTypes,
  powerTypesResolvers,
} from "@/testing/resolvers/powerTypes";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(powerTypesResolvers.listPowerTypes.handler());

describe("usePowerTypes", () => {
  it("should return power types data", async () => {
    const { result } = renderHookWithProviders(() => usePowerTypes());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPowerTypes);
  });
});
