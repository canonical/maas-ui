import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ThirdPartyDriversFormFields from "./ThirdPartyDriversFormFields";

const mockStore = configureStore();

describe("ThirdPartyDriversFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    enable_third_party_drivers: true
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
            name: "enable_third_party_drivers",
            value: true
          }
        ]
      }
    };
  });

  it("updates value for enable_third_party_drivers", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.enable_third_party_drivers = false;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ThirdPartyDriversFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='enable_third_party_drivers']")
        .first()
        .props().value
    ).toBe(false);
  });
});
