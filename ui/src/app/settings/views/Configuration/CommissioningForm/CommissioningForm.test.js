import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MESSAGE_TYPES from "app/base/constants";
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
      },
      general: {
        loading: false,
        loaded: true,
        osInfo: {}
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
      const updateConfigAction = store
        .getActions()
        .find(action => action.type === "UPDATE_CONFIG");
      expect(updateConfigAction).toEqual({
        type: "UPDATE_CONFIG",
        payload: {
          params: [
            { name: "commissioning_distro_series", value: "bionic" },
            { name: "default_min_hwe_kernel", value: "ga-16.04-lowlatency" }
          ]
        },
        meta: {
          model: "config",
          method: "update"
        }
      });
      done();
    }, 0);
  });

  it("dispatches action to fetch general on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <CommissioningForm />
      </Provider>
    );

    const fetchGeneralOsinfoAction = store
      .getActions()
      .find(action => action.type === "FETCH_GENERAL_OSINFO");

    expect(fetchGeneralOsinfoAction).toEqual({
      type: "FETCH_GENERAL_OSINFO",
      meta: {
        model: "general",
        method: "osinfo"
      }
    });
  });
});
