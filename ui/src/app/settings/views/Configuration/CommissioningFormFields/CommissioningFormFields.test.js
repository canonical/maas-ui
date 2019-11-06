import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CommissioningForm from "../CommissioningForm";

const mockStore = configureStore();

describe("CommissioningFormFields", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "commissioning_distro_series",
            value: "bionic",
            choices: [
              ["precise", 'Ubuntu 12.04 LTS "Precise Pangolin"'],
              ["trusty", 'Ubuntu 14.04 LTS "Trusty Tahr"'],
              ["xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']
            ]
          },
          {
            name: "default_min_hwe_kernel",
            value: "ga-16.04-lowlatency"
          }
        ]
      },
      general: {
        osInfo: {
          loaded: true,
          loading: false,
          data: {
            kernels: {
              ubuntu: {
                trusty: [
                  ["hwe-14.04-edge", "xenial (hwe-14.04-edge)"],
                  ["hwe-14.04", "trusty (hwe-14.04)"]
                ],
                xenial: [
                  ["hwe-16.04-edge", "xenial (hwe-16.04-edge)"],
                  ["hwe-16.04", "xenial (hwe-16.04)"]
                ],
                bionic: [
                  ["hwe-18.04-edge", "xenial (hwe-18.04-edge)"],
                  ["hwe-18.04", "xenial (hwe-18.04)"]
                ]
              }
            }
          }
        }
      }
    };
  });

  it("updates value for default distro series", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <CommissioningForm />
      </Provider>
    );

    expect(
      wrapper.find("select[name='commissioning_distro_series']").props().value
    ).toBe("bionic");
  });

  it("updates value for default min kernel", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <CommissioningForm />
      </Provider>
    );

    expect(
      wrapper.find("select[name='default_min_hwe_kernel']").props().value
    ).toBe("ga-16.04-lowlatency");
  });
});
