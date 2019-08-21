import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import WindowsFormFields from "./WindowsFormFields";

const mockStore = configureStore();

describe("WindowsFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    windows_kms_host: ""
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
            name: "windows_kms_host",
            value: ""
          }
        ]
      }
    };
  });

  it("updates value for windows_kms_host", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.windows_kms_host = "127.0.0.1";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <WindowsFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='windows_kms_host']")
        .first()
        .props().value
    ).toBe("127.0.0.1");
  });
});
