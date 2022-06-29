// import { mount } from "enzyme";
import { screen, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Routes from "./Routes";

import settingsURLs from "app/settings/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Routes", () => {
  [
    {
      title: "General",
      path: settingsURLs.configuration.general,
      pattern: settingsURLs.configuration.general,
    },
    {
      title: "Commissioning",
      path: settingsURLs.configuration.commissioning,
      pattern: settingsURLs.configuration.commissioning,
    },
    {
      title: "Kernel parameters",
      path: settingsURLs.configuration.kernelParameters,
      pattern: settingsURLs.configuration.kernelParameters,
    },
    {
      title: "Deploy",
      path: settingsURLs.configuration.deploy,
      pattern: settingsURLs.configuration.deploy,
    },
    {
      title: "Users",
      path: settingsURLs.users.index,
      pattern: settingsURLs.users.index,
    },
    {
      title: "Add user",
      path: settingsURLs.users.add,
      pattern: settingsURLs.users.add,
    },
    {
      title: /^Editing\s+.*$/,
      path: settingsURLs.users.edit({ id: 1 }),
      pattern: settingsURLs.users.edit(null),
    },
    {
      title: "License keys",
      path: settingsURLs.licenseKeys.index,
      pattern: settingsURLs.licenseKeys.index,
    },
    {
      title: "Add license key",
      path: settingsURLs.licenseKeys.add,
      pattern: settingsURLs.licenseKeys.add,
    },
    {
      title: "Update license key",
      path: settingsURLs.licenseKeys.edit({
        osystem: "ubuntu",
        distro_series: "disco",
      }),
      pattern: settingsURLs.licenseKeys.edit(null),
    },
    {
      title: "Storage",
      path: settingsURLs.storage,
      pattern: settingsURLs.storage,
    },
    {
      title: "Proxy",
      path: settingsURLs.network.proxy,
      pattern: settingsURLs.network.proxy,
    },
    {
      title: "DNS",
      path: settingsURLs.network.dns,
      pattern: settingsURLs.network.dns,
    },
    {
      title: "NTP",
      path: settingsURLs.network.ntp,
      pattern: settingsURLs.network.ntp,
    },
    {
      title: "Syslog",
      path: settingsURLs.network.syslog,
      pattern: settingsURLs.network.syslog,
    },
    {
      title: "Network discovery",
      path: settingsURLs.network.networkDiscovery,
      pattern: settingsURLs.network.networkDiscovery,
    },
    {
      title: "Commissioning scripts",
      path: settingsURLs.scripts.commissioning.index,
      pattern: settingsURLs.scripts.commissioning.index,
    },
    {
      title: "Upload commissioning script",
      path: settingsURLs.scripts.commissioning.upload,
      pattern: settingsURLs.scripts.commissioning.upload,
    },
    {
      title: "Testing scripts",
      path: settingsURLs.scripts.testing.index,
      pattern: settingsURLs.scripts.testing.index,
    },
    {
      title: "Upload testing script",
      path: settingsURLs.scripts.testing.upload,
      pattern: settingsURLs.scripts.testing.upload,
    },
    {
      title: "DHCP snippets",
      path: settingsURLs.dhcp.index,
      pattern: settingsURLs.dhcp.index,
    },
    {
      title: "Add DHCP snippet",
      path: settingsURLs.dhcp.add,
      patternpath: settingsURLs.dhcp.add,
    },
    {
      title: /^Editing\s+.*$/,
      path: settingsURLs.dhcp.edit({ id: 1 }),
      pattern: settingsURLs.dhcp.edit(null),
    },
    {
      title: "Package repos",
      path: settingsURLs.repositories.index,
      pattern: settingsURLs.repositories.index,
    },
    {
      title: "Add PPA",
      path: settingsURLs.repositories.add({ type: "ppa" }),
      pattern: settingsURLs.repositories.add(null),
    },
    {
      title: "Edit PPA",
      path: settingsURLs.repositories.edit({ id: 1, type: "ppa" }),
      pattern: settingsURLs.repositories.edit(null),
    },
    {
      title: "Windows",
      path: settingsURLs.images.windows,
      pattern: settingsURLs.images.windows,
    },
    {
      title: "VMWare",
      path: settingsURLs.images.vmware,
      pattern: settingsURLs.images.vmware,
    },
    {
      title: "Ubuntu",
      path: settingsURLs.images.ubuntu,
      pattern: settingsURLs.images.ubuntu,
    },
    {
      title: "Error: Page not found.",
      path: `${settingsURLs.index}/not/a/path`,
      pattern: `${settingsURLs.index}/*`,
    },
  ].forEach(({ title, path }) => {
    it(`Displays: ${title} at: ${path}`, async () => {
      const store = mockStore(rootStateFactory());
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Routes />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      await waitFor(() => expect(document.title).toBe(`${title} | MAAS`));
    });
  });
});
