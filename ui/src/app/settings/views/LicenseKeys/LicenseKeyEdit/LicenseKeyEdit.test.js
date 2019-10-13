import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route } from "react-router-dom";

import { LicenseKeyEdit } from "./LicenseKeyEdit";

const mockStore = configureStore();

describe("LicenseKeyEdit", () => {
  let state;

  beforeEach(() => {
    state = {
      general: {
        osInfo: {
          loaded: true,
          loading: false,
          data: {
            osystems: [["ubuntu", "Ubuntu"], ["windows", "Windows"]],
            releases: [
              ["ubuntu/bionic", "Ubuntu 18.04 LTS 'Bionic Beaver'"],
              ["windows/win2012*", "Windows Server 2012"],
              ["windows/win2019*", "Windows Server 2019"]
            ]
          }
        }
      },
      licensekeys: {
        errors: {},
        items: [
          {
            osystem: "windows",
            distro_series: "win2012",
            license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXA",
            resource_uri: "/MAAS/api/2.0/license-key/windows/win2012"
          },
          {
            osystem: "windows",
            distro_series: "win2019",
            license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXX7",
            resource_uri: "/MAAS/api/2.0/license-key/windows/win2019"
          }
        ],
        loaded: true,
        loading: false,
        saving: false,
        saved: false
      }
    };
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
              key: "testKey"
            }
          ]}
        >
          <LicenseKeyEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("handles license key not found", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/license-keys/foo/bar/edit", key: "testKey" }
          ]}
        >
          <LicenseKeyEdit />
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
              key: "testKey"
            }
          ]}
        >
          <Route
            exact
            path="/settings/license-keys/:osystem/:distro_series/edit"
            component={props => <LicenseKeyEdit {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );

    const form = wrapper.find("LicenseKeyForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("licenseKey")).toStrictEqual(state.licensekeys.items[0]);
  });
});
