import { matchRoutes } from "react-router";

import Settings from "./Settings";

import urls from "@/app/base/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { router } from "@/router";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import { notificationResolvers } from "@/testing/resolvers/notifications";
import { systemResolvers } from "@/testing/resolvers/system";
import { renderWithProviders, screen, setupMockServer } from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  authResolvers.getMeStatistics.handler(),
  configurationsResolvers.listConfigurations.handler(),
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

  it.each([
    urls.settings.userManagement.users,
    urls.settings.userManagement.groups,
    urls.settings.userManagement.singleSignOn,
  ])(
    "shows a permission message at %s without the identities entitlement",
    async (url) => {
      mockServer.use(authResolvers.getMeEntitlements.handler([]));
      const matches = matchRoutes(router.routes, url);
      // The User management layout route holds the entitlement guard.
      renderWithProviders(matches?.at(-2)?.route.element);

      expect(
        await screen.findByRole("heading", {
          name: "You do not have permission to view this page.",
        })
      ).toBeInTheDocument();
    }
  );

  it("shows a permission message at the license keys URL without the license keys entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    const matches = matchRoutes(router.routes, urls.settings.licenseKeys.index);
    renderWithProviders(matches?.at(-1)?.route.element);

    expect(
      await screen.findByRole("heading", {
        name: "You do not have permission to view this page.",
      })
    ).toBeInTheDocument();
  });

  it.each([
    // Scripts pages share a guarded layout route.
    { url: urls.settings.scripts.commissioning.index, depth: -2 },
    { url: urls.settings.scripts.deploying.index, depth: -2 },
    { url: urls.settings.scripts.testing.index, depth: -2 },
    { url: urls.settings.dhcp.index, depth: -1 },
    { url: urls.settings.repositories.index, depth: -1 },
  ])(
    "shows a permission message at $url without the global entities entitlement",
    async ({ url, depth }) => {
      mockServer.use(
        authResolvers.getMeEntitlements.handler([
          factory.entitlement({
            entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
          }),
        ])
      );
      const matches = matchRoutes(router.routes, url);
      renderWithProviders(matches?.at(depth)?.route.element);

      expect(
        await screen.findByRole("heading", {
          name: "You do not have permission to view this page.",
        })
      ).toBeInTheDocument();
    }
  );

  it("renders the storage page without any entitlements", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    const matches = matchRoutes(router.routes, urls.settings.storage);
    renderWithProviders(matches?.at(-1)?.route.element);

    expect(
      await screen.findByRole("heading", { name: "Storage" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "You do not have permission to view this page.",
      })
    ).not.toBeInTheDocument();
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
