import PageContent from "./PageContent";

import { preferencesNavItems } from "@/app/preferences/constants";
import { settingsNavItems } from "@/app/settings/constants";
import {
  getTestState,
  renderWithBrowserRouter,
  screen,
  within,
} from "@/testing/utils";

const state = getTestState();

it("displays sidebar with provided content", () => {
  renderWithBrowserRouter(
    <PageContent
      header="Settings"
      sidePanelContent={<div>Sidebar</div>}
      sidePanelTitle={null}
    >
      content
    </PageContent>
  );
  const aside = screen.getByRole("complementary");
  expect(screen.getByRole("complementary")).not.toHaveClass("is-collapsed");
  expect(within(aside).getByText("Sidebar"));
});

it("displays hidden sidebar when no content provided", () => {
  renderWithBrowserRouter(
    <PageContent
      header="Settings"
      sidePanelContent={null}
      sidePanelTitle={null}
    >
      content
    </PageContent>
  );
  expect(screen.queryByRole("complementary")).toHaveClass("is-collapsed");
});

it("shows the secondary navigation for settings", () => {
  state.status.authenticated = true;
  state.status.connected = true;
  renderWithBrowserRouter(
    <PageContent
      header="Settings"
      sidePanelContent={null}
      sidePanelTitle={null}
    >
      content
    </PageContent>,
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
    <PageContent
      header="Preferences"
      sidePanelContent={null}
      sidePanelTitle={null}
    >
      content
    </PageContent>,
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
    <PageContent
      header="Preferences"
      sidePanelContent={null}
      sidePanelTitle={null}
    >
      content
    </PageContent>,
    { route: "/account/prefs/details", state }
  );

  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

it("doesn't show the side nav if not connected", () => {
  state.status.authenticated = true;
  state.status.connected = false;
  renderWithBrowserRouter(
    <PageContent
      header="Preferences"
      sidePanelContent={null}
      sidePanelTitle={null}
    >
      content
    </PageContent>,
    { route: "/account/prefs/details", state }
  );

  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});
