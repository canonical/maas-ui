import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import KernelParametersFormFields from "./KernelParametersFormFields";

const mockStore = configureStore();

describe("KernelParametersFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    kernel_opts: ""
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
            name: "kernel_opts",
            value: ""
          }
        ]
      }
    };
  });

  it("updates value for kernel_opts", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.kernel_opts = "foo";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <KernelParametersFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='kernel_opts']")
        .first()
        .props().value
    ).toBe("foo");
  });
});
