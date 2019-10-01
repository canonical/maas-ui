import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import { SSLKeyFormFields } from "./SSLKeyFormFields";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

describe("SSLKeyFormFields", () => {
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
        key: ""
      }
    };
    state = {
      sslkey: {
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
          <SSLKeyFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SSLKeyFormFields").exists()).toBe(true);
  });

  it("can set error status", () => {
    state.sslkey.errors = {
      key: ["Key not provided"]
    };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <SSLKeyFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(formikProps.setStatus).toHaveBeenCalled();
  });
});
