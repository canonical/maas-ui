import { Labels as DiscoveriesListLabel } from "./DiscoveriesList/DiscoveriesList";
import NetworkDiscovery, { Label } from "./NetworkDiscovery";
import { Label as NetworkDiscoveryConfigurationFormLabel } from "./NetworkDiscoveryConfigurationForm/NetworkDiscoveryConfigurationForm";

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
import { screen, renderWithBrowserRouter } from "testing/utils";

describe("NetworkDiscovery", () => {
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
      path: urls.networkDiscovery.index,
    },
    {
      label: NetworkDiscoveryConfigurationFormLabel.Title,
      path: urls.networkDiscovery.configuration,
    },
    {
      label: NotFoundLabel.Title,
      path: `${urls.networkDiscovery.index}/not/a/path`,
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<NetworkDiscovery />, {
        route: path,
        state,
        routePattern: `${urls.networkDiscovery.index}/*`,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("displays a notification when discovery is disabled", () => {
    state.config = configStateFactory({
      items: [{ name: ConfigNames.NETWORK_DISCOVERY, value: "disabled" }],
    });
    renderWithBrowserRouter(<NetworkDiscovery />, {
      route: urls.networkDiscovery.index,
      state,
    });
    expect(screen.getByText(Label.Disabled)).toBeInTheDocument();
  });

  it("does not display a notification when discovery is enabled", () => {
    state.config = configStateFactory({
      items: [{ name: ConfigNames.NETWORK_DISCOVERY, value: "enabled" }],
    });
    renderWithBrowserRouter(<NetworkDiscovery />, {
      route: urls.networkDiscovery.index,
      state,
    });
    expect(screen.queryByText(Label.Disabled)).not.toBeInTheDocument();
  });

  it("displays a message if not an admin", () => {
    state.user.auth = authStateFactory({
      user: userFactory({ is_superuser: false }),
    });
    renderWithBrowserRouter(<NetworkDiscovery />, {
      route: urls.networkDiscovery.index,
      state,
    });
    expect(screen.getByText(Label.Permissions)).toBeInTheDocument();
  });
});
