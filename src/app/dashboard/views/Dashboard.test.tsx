import { screen } from "@testing-library/react";

import Dashboard, { Label } from "./Dashboard";
import { Label as DashboardConfigurationFormLabel } from "./DashboardConfigurationForm/DashboardConfigurationForm";
import { Labels as DiscoveriesListLabel } from "./DiscoveriesList/DiscoveriesList";

import urls from "app/base/urls";
import { Label as NotFoundLabel } from "app/base/views/NotFound/NotFound";
import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("Dashboard", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: ConfigNames.NETWORK_DISCOVERY, value: "enabled" }],
      }),
      user: userStateFactory({
        auth: authStateFactory({ user: userFactory({ is_superuser: true }) }),
      }),
    });
  });

  [
    {
      label: DiscoveriesListLabel.DiscoveriesList,
      path: urls.dashboard.index,
    },
    {
      label: DashboardConfigurationFormLabel.Title,
      path: urls.dashboard.configuration,
    },
    {
      label: NotFoundLabel.Title,
      path: `${urls.dashboard.index}/not/a/path`,
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<Dashboard />, {
        route: path,
        state,
        routePattern: `${urls.dashboard.index}/*`,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("displays a notification when discovery is disabled", () => {
    state.config = configStateFactory({
      items: [{ name: ConfigNames.NETWORK_DISCOVERY, value: "disabled" }],
    });
    renderWithBrowserRouter(<Dashboard />, {
      route: urls.dashboard.index,
      state,
    });
    expect(screen.getByText(Label.Disabled)).toBeInTheDocument();
  });

  it("does not display a notification when discovery is enabled", () => {
    state.config = configStateFactory({
      items: [{ name: ConfigNames.NETWORK_DISCOVERY, value: "enabled" }],
    });
    renderWithBrowserRouter(<Dashboard />, {
      route: urls.dashboard.index,
      state,
    });
    expect(screen.queryByText(Label.Disabled)).not.toBeInTheDocument();
  });

  it("displays a message if not an admin", () => {
    state.user.auth = authStateFactory({
      user: userFactory({ is_superuser: false }),
    });
    renderWithBrowserRouter(<Dashboard />, {
      route: urls.dashboard.index,
      state,
    });
    expect(screen.getByText(Label.Permissions)).toBeInTheDocument();
  });
});
