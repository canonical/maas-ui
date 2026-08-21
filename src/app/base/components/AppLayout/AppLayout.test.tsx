import AppLayout from "@/app/base/components/AppLayout/AppLayout";
import { preferencesNavItems } from "@/app/preferences/constants";
import { settingsNavItems } from "@/app/settings/constants";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen } from "@/testing/utils";

describe("AppLayout", () => {
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
});
