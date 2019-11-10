import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import LicenseKeyForm from "../LicenseKeyForm";

const mockStore = configureStore();

describe("LicenseKeyFormFields", () => {
  let state, osystems, releases;

  beforeEach(() => {
    osystems = [["windows", "Windows"]];
    releases = {
      windows: [{ value: "win2012", label: "Windows Server 2012" }]
    };
    state = {
      config: {
        items: []
      },
      general: {
        osInfo: {
          loaded: true,
          loading: false,
          data: {
            osystems: [
              ["ubuntu", "Ubuntu"],
              ["windows", "Windows"]
            ],
            releases: [
              ["ubuntu/bionic", "Ubuntu 18.04 LTS 'Bionic Beaver'"],
              ["windows/win2012*", "Windows Server 2012"]
            ]
          }
        }
      },
      licensekeys: {
        loading: false,
        loaded: true,
        saved: false,
        errors: {},
        items: []
      }
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <LicenseKeyForm osystems={osystems} releases={releases} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("LicenseKeyFormFields").exists()).toBe(true);
  });
});
