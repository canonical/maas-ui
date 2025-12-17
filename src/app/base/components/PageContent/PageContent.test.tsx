import PageContent from "./PageContent";

import { preferencesNavItems } from "@/app/preferences/constants";
import { settingsNavItems } from "@/app/settings/constants";
import { getTestState, renderWithBrowserRouter, screen } from "@/testing/utils";

const state = getTestState();

it("shows the secondary navigation for settings", () => {
  state.status.authenticated = true;
  state.status.connected = true;
  renderWithBrowserRouter(
    <PageContent header="Settings">content</PageContent>,
    { route: "/settings/configuration/general", state }
  );

  expect(screen.getByRole("navigation")).toBeInTheDocument();

  settingsNavItems.forEach((item) => {
    expect(screen.getByText(item.label)).toBeInTheDocument();
  });
});

it("shows the secondary navigation for preferences", () => {
  state.status.authenticated = true;
  state.status.connected = true;
  renderWithBrowserRouter(
    <PageContent header="Preferences">content</PageContent>,
    { route: "/account/prefs/details", state }
  );

  expect(screen.getByRole("navigation")).toBeInTheDocument();

  preferencesNavItems.forEach((item) => {
    expect(screen.getByText(item.label)).toBeInTheDocument();
  });
});

it("doesn't show the side nav if not authenticated", () => {
  state.status.authenticated = false;
  state.status.connected = true;
  renderWithBrowserRouter(
    <PageContent header="Preferences">content</PageContent>,
    { route: "/account/prefs/details", state }
  );

  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

it("doesn't show the side nav if not connected", () => {
  state.status.authenticated = true;
  state.status.connected = false;
  renderWithBrowserRouter(
    <PageContent header="Preferences">content</PageContent>,
    { route: "/account/prefs/details", state }
  );

  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});
