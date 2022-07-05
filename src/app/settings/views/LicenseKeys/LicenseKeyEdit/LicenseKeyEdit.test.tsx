import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { LicenseKeyEdit } from "./LicenseKeyEdit";

import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  licenseKeys as licenseKeysFactory,
  licenseKeysState as licenseKeysStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LicenseKeyEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: true,
          loading: false,
          data: osInfoFactory({
            osystems: [
              ["ubuntu", "Ubuntu"],
              ["windows", "Windows"],
            ],
            releases: [
              ["ubuntu/bionic", "Ubuntu 18.04 LTS 'Bionic Beaver'"],
              ["windows/win2012*", "Windows Server 2012"],
              ["windows/win2019*", "Windows Server 2019"],
            ],
          }),
        }),
      }),
      licensekeys: licenseKeysStateFactory({
        errors: {},
        items: [
          licenseKeysFactory({
            osystem: "windows",
            distro_series: "win2012",
            license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXA",
            resource_uri: "/MAAS/api/2.0/license-key/windows/win2012",
          }),
          licenseKeysFactory({
            osystem: "windows",
            distro_series: "win2019",
            license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXX7",
            resource_uri: "/MAAS/api/2.0/license-key/windows/win2019",
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a loading component if loading", () => {
    state.licensekeys.loading = true;
    state.licensekeys.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/license-keys/window/windows2012/edit",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LicenseKeyEdit />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("handles license key not found", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/license-keys/foo/bar/edit", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LicenseKeyEdit />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("h4").text()).toBe("License key not found");
  });

  it("can display a license key edit form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/license-keys/windows/win2012/edit",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<LicenseKeyEdit />}
                path="/settings/license-keys/:osystem/:distro_series/edit"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const form = wrapper.find("LicenseKeyForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("licenseKey")).toStrictEqual(state.licensekeys.items[0]);
  });
});
