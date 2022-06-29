import Routes from "./Routes";

import settingsURLs from "app/settings/urls";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  userState as userStateFactory,
  statusState as statusStateFactory,
  authState as authStateFactory,
  user as userFactory,
  licenseKeys as licenseKeysFactory,
  licenseKeysState as licenseKeysStateFactory,
  packageRepositoryState as packageRepositoryStateFactory,
  packageRepository as packageRepositoryFactory,
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

let state: RootState;

const licensekey = licenseKeysFactory({
  osystem: "ubuntu",
  distro_series: "disco",
});

const user = userFactory({
  id: 1,
  username: "admin",
});

const packageRepository = packageRepositoryFactory({ id: 1 });
const dhcpSnippet = dhcpSnippetFactory();

beforeEach(() => {
  state = rootStateFactory({
    user: userStateFactory({
      auth: authStateFactory({ loaded: true, user }),
      loaded: true,
      items: [user],
    }),
    status: statusStateFactory({ externalAuthURL: null }),
    licensekeys: licenseKeysStateFactory({ loaded: true, items: [licensekey] }),
    packagerepository: packageRepositoryStateFactory({
      loaded: true,
      items: [packageRepository],
    }),
    dhcpsnippet: dhcpSnippetStateFactory({
      loaded: true,
      items: [dhcpSnippet],
    }),
  });
});

const routes = [
  {
    title: "General",
    path: settingsURLs.configuration.general,
  },
  {
    title: "Commissioning",
    path: settingsURLs.configuration.commissioning,
  },
  {
    title: "Kernel parameters",
    path: settingsURLs.configuration.kernelParameters,
  },
  {
    title: "Deploy",
    path: settingsURLs.configuration.deploy,
  },
  {
    title: "Users",
    path: settingsURLs.users.index,
  },
  {
    title: "Add user",
    path: settingsURLs.users.add,
  },
  {
    title: `Editing \`${user.username}\``,
    path: settingsURLs.users.edit({ id: user.id }),
    pattern: `${settingsURLs.users.edit(null)}/*`,
  },
  {
    title: "License keys",
    path: settingsURLs.licenseKeys.index,
  },
  {
    title: "Add license key",
    path: settingsURLs.licenseKeys.add,
  },
  {
    title: "Update license key",
    path: settingsURLs.licenseKeys.edit({
      osystem: licensekey.osystem,
      distro_series: licensekey.distro_series,
    }),
    pattern: `${settingsURLs.licenseKeys.edit(null)}/*`,
  },
  {
    title: "Storage",
    path: settingsURLs.storage,
  },
  {
    title: "Proxy",
    path: settingsURLs.network.proxy,
  },
  {
    title: "DNS",
    path: settingsURLs.network.dns,
  },
  {
    title: "NTP",
    path: settingsURLs.network.ntp,
  },
  {
    title: "Syslog",
    path: settingsURLs.network.syslog,
  },
  {
    title: "Network discovery",
    path: settingsURLs.network.networkDiscovery,
  },
  {
    title: "Commissioning scripts",
    path: settingsURLs.scripts.commissioning.index,
  },
  {
    title: "Upload commissioning script",
    path: settingsURLs.scripts.commissioning.upload,
  },
  {
    title: "Testing scripts",
    path: settingsURLs.scripts.testing.index,
  },
  {
    title: "Upload testing script",
    path: settingsURLs.scripts.testing.upload,
  },
  {
    title: "DHCP snippets",
    path: settingsURLs.dhcp.index,
    pattern: settingsURLs.dhcp.index,
  },
  {
    title: "Add DHCP snippet",
    path: settingsURLs.dhcp.add,
  },
  {
    title: `Editing \`${dhcpSnippet.name}\``,
    path: settingsURLs.dhcp.edit({ id: dhcpSnippet.id }),
    pattern: `${settingsURLs.dhcp.edit(null)}/*`,
  },
  {
    title: "Package repos",
    path: settingsURLs.repositories.index,
  },
  {
    title: "Add PPA",
    path: settingsURLs.repositories.add({ type: "ppa" }),
  },
  {
    title: "Edit PPA",
    path: settingsURLs.repositories.edit({
      id: packageRepository.id,
      type: "ppa",
    }),
    pattern: `${settingsURLs.repositories.edit(null)}/*`,
  },
  {
    title: "Windows",
    path: settingsURLs.images.windows,
  },
  {
    title: "VMWare",
    path: settingsURLs.images.vmware,
  },
  {
    title: "Ubuntu",
    path: settingsURLs.images.ubuntu,
  },
  {
    title: "Error: Page not found.",
    path: `${settingsURLs.index}/not/a/path`,
  },
];

describe("Routes", () => {
  routes.forEach(({ title, path, pattern }) => {
    it(`Displays: ${title} at: ${path}`, () => {
      renderWithBrowserRouter(<Routes />, {
        wrapperProps: { routePattern: pattern, state },
        route: path,
      });
      expect(document.title).toBe(`${title} | MAAS`);
    });
  });
});
