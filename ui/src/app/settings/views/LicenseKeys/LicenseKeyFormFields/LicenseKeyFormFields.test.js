import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import { LicenseKeyFormFields } from "./LicenseKeyFormFields";

const mockStore = configureStore();

describe("LicenseKeyFormFields", () => {
  let formikProps, state, osystems, releases;

  beforeEach(() => {
    osystems = [["windows", "Windows"]];
    releases = {
      windows: [{ value: "win2012", label: "Windows Server 2012" }]
    };

    formikProps = {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFieldTouched: jest.fn(),
      setFieldValue: jest.fn(),
      setStatus: jest.fn(),
      touched: {},
      values: {
        osystem: "windows",
        distro_series: "win2012",
        license_key: ""
      }
    };
    state = {
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
          <LicenseKeyFormFields
            osystems={osystems}
            releases={releases}
            formikProps={formikProps}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("LicenseKeyFormFields").exists()).toBe(true);
  });

  it("can set error status", () => {
    state.licensekeys.errors = {
      license_key: ["License key is required."]
    };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <LicenseKeyFormFields
            osystems={osystems}
            releases={releases}
            formikProps={formikProps}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(formikProps.setStatus).toHaveBeenCalled();
  });
});
