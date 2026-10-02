import AppLayout from "@/app/base/components/AppLayout/AppLayout";
import { preferencesNavItems } from "@/app/preferences/constants";
import { settingsNavItems } from "@/app/settings/constants";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { notificationResolvers } from "@/testing/resolvers/notifications";
import { systemResolvers } from "@/testing/resolvers/system";
import { renderWithProviders, screen, setupMockServer } from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  authResolvers.getMeStatistics.handler(),
  notificationResolvers.listNotifications.handler(),
  systemResolvers.getSystemInfo.handler()
);

describe("AppLayout", () => {
  it("shows the persistent hardening banner only while authenticated", async () => {
    mockServer.use(
      notificationResolvers.listNotifications.handler({
        items: [
          factory.notificationFactoryV3({
            ident: "hardening-api-bind",
            dismissable: false,
          }),
        ],
        total: 1,
      })
    );
    const { rerender } = renderWithProviders(<AppLayout>content</AppLayout>, {
      state: {
        status: factory.statusState({ authenticated: true, connected: true }),
      },
    });

    expect(
      await screen.findByText(/1 condition has not been met/)
    ).toBeInTheDocument();
    rerender(<AppLayout>content</AppLayout>, {
      state: factory.rootState({
        status: factory.statusState({ authenticated: false }),
      }),
    });
    expect(
      screen.queryByText(/1 condition has not been met/)
    ).not.toBeInTheDocument();
  });

  it("shows the secondary navigation for settings", () => {
    renderWithProviders(<AppLayout>content</AppLayout>, {
      state: {
        status: factory.statusState({ authenticated: true, connected: true }),
      },
      initialEntries: ["/settings/configuration/general"],
    });

    expect(
      screen.getByRole("heading", { name: "Settings", level: 2 })
    ).toBeInTheDocument();

    settingsNavItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it("shows the secondary navigation for preferences", () => {
    renderWithProviders(<AppLayout>content</AppLayout>, {
      state: {
        status: factory.statusState({ authenticated: true, connected: true }),
      },
      initialEntries: ["/account/prefs/details"],
    });

    expect(
      screen.getByRole("heading", { name: "My preferences", level: 2 })
    ).toBeInTheDocument();

    preferencesNavItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it("doesn't show the side nav if not authenticated", () => {
    renderWithProviders(<AppLayout>content</AppLayout>, {
      state: { status: factory.statusState({ connected: true }) },
      initialEntries: ["/account/prefs/details"],
    });

    expect(
      screen.queryByRole("heading", { name: "My preferences", level: 2 })
    ).not.toBeInTheDocument();
  });

  it("doesn't show the side nav if not connected", () => {
    renderWithProviders(<AppLayout>content</AppLayout>, {
      state: { status: factory.statusState({ authenticated: true }) },
      initialEntries: ["/account/prefs/details"],
    });

    expect(
      screen.queryByRole("heading", { name: "My preferences", level: 2 })
    ).not.toBeInTheDocument();
  });

  it("doesn't show a modal by default", () => {
    renderWithProviders(<AppLayout>content</AppLayout>);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
