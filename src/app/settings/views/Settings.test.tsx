import { matchRoutes } from "react-router";

import Settings from "./Settings";

import urls from "@/app/base/urls";
import { router } from "@/router";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { notificationResolvers } from "@/testing/resolvers/notifications";
import { systemResolvers } from "@/testing/resolvers/system";
import { renderWithProviders, screen, setupMockServer } from "@/testing/utils";

setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  authResolvers.getMeStatistics.handler(),
  notificationResolvers.listNotifications.handler(),
  systemResolvers.getSystemInfo.handler()
);

describe("Settings", () => {
  it("routes the hardening settings URL to the hardening status page", async () => {
    const matches = matchRoutes(
      router.routes,
      urls.settings.security.hardeningStatus
    );
    renderWithProviders(matches?.at(-1)?.route.element);

    expect(
      await screen.findByRole("heading", { name: "Hardening status" })
    ).toBeInTheDocument();
  });

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
