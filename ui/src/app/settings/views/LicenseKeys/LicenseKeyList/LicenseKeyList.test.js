import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LicenseKeyList from ".";

const mockStore = configureStore();

describe("LicenseKeyList", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: []
      },
      licensekeys: {
        loading: false,
        loaded: true,
        errors: {},
        items: [
          {
            osystem: "windows",
            distro_series: "win2012",
            license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
          },
          {
            osystem: "windows",
            distro_series: "win2019",
            license_key: "XXXXX-XXXXX-XXXXX-XXXXX-AAABBB"
          }
        ]
      }
    };
  });

  it("displays a loading component if loading", () => {
    const state = { ...initialState };
    state.licensekeys.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <LicenseKeyList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("hides the table if license keys haven't loaded", () => {
    const state = { ...initialState };
    state.licensekeys.loaded = false;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <LicenseKeyList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("MainTable").exists()).toBe(false);
  });

  it("shows the table if there are license keys", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <LicenseKeyList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("dispatches action to fetch license keys on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <LicenseKeyList />
        </MemoryRouter>
      </Provider>
    );

    expect(store.getActions()).toEqual([
      {
        type: "FETCH_LICENSE_KEYS"
      }
    ]);
  });
});
