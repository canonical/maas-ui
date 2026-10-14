import { matchRoutes, useRoutes } from "react-router";

import Settings from "./Settings";

import urls from "@/app/base/urls";
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

const settingsRoute = matchRoutes(router.routes, urls.settings.index)!.find(
  ({ route }) => route.path === urls.settings.index
)!.route;

const SettingsRoutes = () => useRoutes([settingsRoute]);

const noPermissionHeading = {
  name: "You do not have permission to view this page.",
};

describe("Settings", () => {
  it("routes the hardening settings URL to the hardening status page", async () => {
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.security.hardeningStatus],
    });

    expect(
      await screen.findByRole("heading", { name: "Hardening status" })
    ).toBeInTheDocument();
  });

  it("shows a permission message on the users page without the identities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.userManagement.users],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
    ).toBeInTheDocument();
  });

  it("shows a permission message on the groups page without the identities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.userManagement.groups],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
    ).toBeInTheDocument();
  });

  it("shows a permission message on the single sign-on page without the identities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.userManagement.singleSignOn],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
    ).toBeInTheDocument();
  });

  it("shows a permission message on the license keys page without the license keys entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.licenseKeys.index],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
    ).toBeInTheDocument();
  });

  it("shows a permission message on the commissioning scripts page without the global entities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.scripts.commissioning.index],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
    ).toBeInTheDocument();
  });

  it("shows a permission message on the deployment scripts page without the global entities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.scripts.deploying.index],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
    ).toBeInTheDocument();
  });

  it("shows a permission message on the testing scripts page without the global entities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.scripts.testing.index],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
    ).toBeInTheDocument();
  });

  it("shows a permission message on the DHCP snippets page without the global entities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.dhcp.index],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
    ).toBeInTheDocument();
  });

  it("shows a permission message on the package repositories page without the global entities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<SettingsRoutes />, {
      initialEntries: [urls.settings.repositories.index],
    });

    expect(
      await screen.findByRole("heading", noPermissionHeading)
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
