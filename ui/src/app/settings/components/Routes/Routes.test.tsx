import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Routes from "./Routes";

import settingsURLs from "app/settings/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Routes", () => {
  [
    {
      component: "General",
      path: settingsURLs.configuration.general,
    },
    {
      component: "Commissioning",
      path: settingsURLs.configuration.commissioning,
    },
    {
      component: "KernelParameters",
      path: settingsURLs.configuration.kernelParameters,
    },
    {
      component: "Deploy",
      path: settingsURLs.configuration.deploy,
    },
    {
      component: "UsersList",
      path: settingsURLs.users.index,
    },
    {
      component: "UserAdd",
      path: settingsURLs.users.add,
    },
    {
      component: "UserEdit",
      path: settingsURLs.users.edit({ id: 1 }),
    },
    {
      component: "LicenseKeyList",
      path: settingsURLs.licenseKeys.index,
    },
    {
      component: "LicenseKeyAdd",
      path: settingsURLs.licenseKeys.add,
    },
    {
      component: "LicenseKeyEdit",
      path: settingsURLs.licenseKeys.edit({
        osystem: "ubuntu",
        distro_series: "disco",
      }),
    },
    {
      component: "StorageForm",
      path: settingsURLs.storage,
    },
    {
      component: "ProxyForm",
      path: settingsURLs.network.proxy,
    },
    {
      component: "DnsForm",
      path: settingsURLs.network.dns,
    },
    {
      component: "NtpForm",
      path: settingsURLs.network.ntp,
    },
    {
      component: "SyslogForm",
      path: settingsURLs.network.syslog,
    },
    {
      component: "NetworkDiscoveryForm",
      path: settingsURLs.network.networkDiscovery,
    },
    {
      component: "ScriptsList",
      path: settingsURLs.scripts.commissioning.index,
    },
    {
      component: "ScriptsUpload",
      path: settingsURLs.scripts.commissioning.upload,
    },
    {
      component: "ScriptsList",
      path: settingsURLs.scripts.testing.index,
    },
    {
      component: "ScriptsUpload",
      path: settingsURLs.scripts.testing.upload,
    },
    {
      component: "DhcpList",
      path: settingsURLs.dhcp.index,
    },
    {
      component: "DhcpAdd",
      path: settingsURLs.dhcp.add,
    },
    {
      component: "DhcpEdit",
      path: settingsURLs.dhcp.edit({ id: 1 }),
    },
    {
      component: "RepositoriesList",
      path: settingsURLs.repositories.index,
    },
    {
      component: "RepositoryAdd",
      path: settingsURLs.repositories.add({ type: "ppa" }),
    },
    {
      component: "RepositoryEdit",
      path: settingsURLs.repositories.edit({ id: 1, type: "ppa" }),
    },
    {
      component: "Windows",
      path: settingsURLs.images.windows,
    },
    {
      component: "VMWare",
      path: settingsURLs.images.vmware,
    },
    {
      component: "ThirdPartyDrivers",
      path: settingsURLs.images.ubuntu,
    },
    {
      component: "NotFound",
      path: "/not/a/path",
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <Routes />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
