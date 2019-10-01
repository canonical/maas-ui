import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import { SSHKeyFormFields } from "./SSHKeyFormFields";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

describe("SSHKeyFormFields", () => {
  let formikProps, state;

  beforeEach(() => {
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
        protocol: ""
      }
    };
    state = {
      sshkey: {
        loading: false,
        loaded: true,
        items: []
      }
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <SSHKeyFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SSHKeyFormFields").exists()).toBe(true);
  });

  it("can set error status", () => {
    state.sshkey.errors = {
      key: ["Key not provided"]
    };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <SSHKeyFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(formikProps.setStatus).toHaveBeenCalled();
  });

  it("can set non-field errors", () => {
    state.sshkey.errors = {
      __all__: ["Key already exists"]
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <SSHKeyFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").text()).toEqual(
      "Error:Key already exists"
    );
  });

  it("can show id field", () => {
    const store = mockStore(state);
    formikProps.values.protocol = "lp";
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <SSHKeyFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          n => n.name() === "FormikField" && n.prop("fieldKey") === "auth_id"
        )
        .exists()
    ).toBe(true);
  });

  it("can show key field", () => {
    const store = mockStore(state);
    formikProps.values.protocol = "upload";
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <SSHKeyFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          n => n.name() === "FormikField" && n.prop("fieldKey") === "key"
        )
        .exists()
    ).toBe(true);
  });
});
