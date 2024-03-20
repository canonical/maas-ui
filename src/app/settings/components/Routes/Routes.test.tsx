import Routes from "./Routes";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter } from "@/testing/utils";

let state: RootState;

const licensekey = factory.licenseKeys({
  osystem: "ubuntu",
  distro_series: "disco",
});

const user = factory.user({
  id: 1,
  username: "admin",
});

const packageRepository = factory.packageRepository({ id: 1 });
const dhcpSnippet = factory.dhcpSnippet();

beforeEach(() => {
  state = factory.rootState({
    user: factory.userState({
      auth: factory.authState({ loaded: true, user }),
      loaded: true,
      items: [user],
    }),
    status: factory.statusState({ externalAuthURL: null }),
    licensekeys: factory.licenseKeysState({
      loaded: true,
      items: [licensekey],
    }),
    packagerepository: factory.packageRepositoryState({
      loaded: true,
      items: [packageRepository],
    }),
    dhcpsnippet: factory.dhcpSnippetState({
      loaded: true,
      items: [dhcpSnippet],
    }),
  });
});

const routes = [
  {
    title: "General",
    path: urls.settings.configuration.general,
  },
  {
    title: "Commissioning",
    path: urls.settings.configuration.commissioning,
  },
  {
    title: "Kernel parameters",
    path: urls.settings.configuration.kernelParameters,
  },
  {
    title: "Deploy",
    path: urls.settings.configuration.deploy,
  },
  {
    title: "Security protocols",
    path: urls.settings.security.securityProtocols,
  },
  {
    title: "Secret storage",
    path: urls.settings.security.secretStorage,
  },
  {
    title: "Session timeout",
    path: urls.settings.security.sessionTimeout,
  },
  {
    title: "IPMI settings",
    path: urls.settings.security.ipmiSettings,
  },
  {
    title: "Users",
    path: urls.settings.users.index,
  },
  {
    title: "License keys",
    path: urls.settings.licenseKeys.index,
  },
  {
    title: "Storage",
    path: urls.settings.storage,
  },
  {
    title: "Proxy",
    path: urls.settings.network.proxy,
  },
  {
    title: "DNS",
    path: urls.settings.network.dns,
  },
  {
    title: "NTP",
    path: urls.settings.network.ntp,
  },
  {
    title: "Syslog",
    path: urls.settings.network.syslog,
  },
  {
    title: "Network discovery",
    path: urls.settings.network.networkDiscovery,
  },
  {
    title: "Commissioning scripts",
    path: urls.settings.scripts.commissioning.index,
  },
  {
    title: "Testing scripts",
    path: urls.settings.scripts.testing.index,
  },
  {
    title: "DHCP snippets",
    path: urls.settings.dhcp.index,
  },
  {
    title: "Package repos",
    path: urls.settings.repositories.index,
  },
  {
    title: "Windows",
    path: urls.settings.images.windows,
  },
  {
    title: "VMWare",
    path: urls.settings.images.vmware,
  },
  {
    title: "Ubuntu",
    path: urls.settings.images.ubuntu,
  },
  {
    title: "Error: Page not found",
    path: `${urls.settings.index}/not/a/path`,
  },
];

describe("Routes", () => {
  routes.forEach(({ title, path }) => {
    it(`Displays: ${title} at: ${path}`, () => {
      renderWithBrowserRouter(<Routes />, {
        routePattern: `${urls.settings.index}/*`,
        state,
        route: path,
      });
      expect(document.title).toBe(`${title} | MAAS`);
    });
  });

  it("redirects from base URL to configuration", () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.settings.index,
      state,
      routePattern: `${urls.settings.index}/*`,
    });
    expect(window.location.pathname).toBe(urls.settings.configuration.index);
  });

  it("redirects from configuration index to general", () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.settings.configuration.index,
      state,
      routePattern: `${urls.settings.index}/*`,
    });
    expect(window.location.pathname).toBe(urls.settings.configuration.general);
  });

  it("redirects from network index to proxy", () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.settings.network.index,
      state,
      routePattern: `${urls.settings.index}/*`,
    });
    expect(window.location.pathname).toBe(urls.settings.network.proxy);
  });
});
