import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeployFormFields from "./DeployFormFields";

const mockStore = configureStore();

describe("DeployFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    default_osystem: "ubuntu",
    default_distro_series: "bionic"
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
            name: "default_osystem",
            value: "ubuntu",
            choices: [["centos", "CentOS"], ["ubuntu", "Ubuntu"]]
          },
          {
            name: "default_distro_series",
            value: "bionic",
            choices: [
              ["precise", 'Ubuntu 12.04 LTS "Precise Pangolin"'],
              ["trusty", 'Ubuntu 14.04 LTS "Trusty Tahr"'],
              ["xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']
            ]
          }
        ]
      },
      general: {
        loading: false,
        loaded: true,
        osInfo: {
          releases: [
            ["centos/centos66", "CentOS 6"],
            ["centos/centos70", "CentOS 7"],
            ["ubuntu/precise", "Ubuntu 12.04 LTS 'Precise Pangolin'"],
            ["ubuntu/trusty", "Ubuntu 14.04 LTS 'Trusty Tahr'"]
          ]
        }
      }
    };
  });

  it("updates value for default osystem", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.default_osystem = "ubuntu";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DeployFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='default_osystem']")
        .first()
        .props().value
    ).toBe("ubuntu");
  });

  it("updates value for default distro series", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.default_distro_series = "centos66";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DeployFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper
        .find("[name='default_distro_series']")
        .first()
        .props().value
    ).toBe("centos66");
  });
});
