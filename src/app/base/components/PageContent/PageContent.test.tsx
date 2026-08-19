import PageContent from "./PageContent";

import { preferencesNavItems } from "@/app/preferences/constants";
import { settingsNavItems } from "@/app/settings/constants";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen } from "@/testing/utils";

it("shows the secondary navigation for settings", () => {
  renderWithProviders(<PageContent header="Settings">content</PageContent>, {
    state: {
      status: factory.statusState({ authenticated: true, connected: true }),
    },
    initialEntries: ["/settings/configuration/general"],
  });

  expect(screen.getByRole("navigation")).toBeInTheDocument();

  settingsNavItems.forEach((item) => {
    expect(screen.getByText(item.label)).toBeInTheDocument();
  });
});

it("shows the secondary navigation for preferences", () => {
  renderWithProviders(<PageContent header="Preferences">content</PageContent>, {
    state: {
      status: factory.statusState({ authenticated: true, connected: true }),
    },
    initialEntries: ["/account/prefs/details"],
  });

  expect(screen.getByRole("navigation")).toBeInTheDocument();

  preferencesNavItems.forEach((item) => {
    expect(screen.getByText(item.label)).toBeInTheDocument();
  });
});

it("doesn't show the side nav if not authenticated", () => {
  renderWithProviders(<PageContent header="Preferences">content</PageContent>, {
    state: { status: factory.statusState({ connected: true }) },
  });

  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

it("doesn't show the side nav if not connected", () => {
  renderWithProviders(<PageContent header="Preferences">content</PageContent>, {
    state: { status: factory.statusState({ authenticated: true }) },
  });

  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});
