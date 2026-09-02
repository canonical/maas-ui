import Settings from "./Settings";

import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { renderWithProviders, setupMockServer } from "@/testing/utils";

setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  authResolvers.getMeStatistics.handler()
);

describe("Settings", () => {
  it("dispatches action to fetch config on load", () => {
    const state = factory.rootState();

    const { store } = renderWithProviders(<Settings />, { state });

    const fetchConfigAction = store
      .getActions()
      .find((action) => action.type === "config/fetch");

    expect(fetchConfigAction).toEqual({
      type: "config/fetch",
      meta: {
        model: "config",
        method: "list",
      },
      payload: null,
    });
  });
});
