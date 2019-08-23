import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMWareFormFields from "./VMWareFormFields";

const mockStore = configureStore();

describe("VMWareFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    vcenter_server: ""
  };

  beforeEach(() => {
    baseFormikProps = {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      initialValues: { ...baseValues },
      touched: {},
      values: { ...baseValues }
    };
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "vcenter_server",
            value: ""
          },
          {
            name: "vcenter_username",
            value: ""
          },
          {
            name: "vcenter_password",
            value: ""
          },
          {
            name: "vcenter_datacenter",
            value: ""
          }
        ]
      }
    };
  });

  it("updates value for vcenter_server", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.vcenter_server = "my server";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='vcenter_server']")
        .first()
        .props().value
    ).toBe("my server");
  });

  it("updates value for vcenter_username", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.vcenter_username = "admin";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='vcenter_username']")
        .first()
        .props().value
    ).toBe("admin");
  });

  it("updates value for vcenter_password", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.vcenter_password = "passwd";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='vcenter_password']")
        .first()
        .props().value
    ).toBe("passwd");
  });

  it("updates value for vcenter_datacenter", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.vcenter_datacenter = "my datacenter";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='vcenter_datacenter']")
        .first()
        .props().value
    ).toBe("my datacenter");
  });
});
