import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import GeneralFormFields from "./GeneralFormFields";

const mockStore = configureStore();

describe("GeneralFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    maas_name: "bionic-maas",
    enable_analytics: true
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
            name: "maas_name",
            value: "bionic"
          },
          {
            name: "enable_analytics",
            value: true
          }
        ]
      }
    };
  });

  it("updates value for maas_name", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.maas_name = "trusty";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <GeneralFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='maas_name']")
        .first()
        .props().value
    ).toBe("trusty");
  });

  it("updates value for enable_analytics", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.enable_analytics = false;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <GeneralFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='enable_analytics']")
        .first()
        .props().value
    ).toBe(false);
  });
});
