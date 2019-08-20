import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CommissioningForm from "./CommissioningForm";

const mockStore = configureStore();

describe("CommissioningForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "default_distro_series",
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
            value: "ga-16.04-lowlatency",
            choices: [
              ["", "--- No minimum kernel ---"],
              ["ga-16.04-lowlatency", "xenial (ga-16.04-lowlatency)"],
              ["ga-16.04", "xenial (ga-16.04)"],
              ["hwe-16.04-lowlatency", "xenial (hwe-16.04-lowlatency)"],
              ["hwe-16.04", "xenial (hwe-16.04)"],
              ["hwe-16.04-edge", "xenial (hwe-16.04-edge)"],
              [
                "hwe-16.04-lowlatency-edge",
                "xenial (hwe-16.04-lowlatency-edge)"
              ]
            ]
          }
        ]
      }
    };
  });

  it("dispatched an action to update config on save button click", done => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CommissioningForm />
      </Provider>
    );
    wrapper.find("form").simulate("submit");

    // since Formik handler is evaluated asynchronously we have to delay checking the assertion
    window.setTimeout(() => {
      expect(store.getActions()).toEqual([
        {
          type: "UPDATE_CONFIG",
          payload: {
            params: [
              { name: "default_distro_series", value: "bionic" },
              { name: "default_min_hwe_kernel", value: "ga-16.04-lowlatency" }
            ]
          },
          meta: {
            model: "config",
            method: "update",
            type: 0
          }
        }
      ]);
      done();
    }, 0);
  });
});
