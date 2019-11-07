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
      general: {
        osInfo: {
          loaded: true,
          loading: false,
          data: {
            osystems: [["ubuntu", "Ubuntu"], ["windows", "Windows"]],
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
