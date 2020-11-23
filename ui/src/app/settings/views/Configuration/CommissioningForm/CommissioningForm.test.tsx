import { TSFixMe } from "@canonical/react-components";
import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CommissioningForm from "./CommissioningForm";

import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("CommissioningForm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: "commissioning_distro_series",
            value: "bionic",
            choices: [
              ["precise", 'Ubuntu 12.04 LTS "Precise Pangolin"'],
              ["trusty", 'Ubuntu 14.04 LTS "Trusty Tahr"'],
              ["xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
            ],
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
                "xenial (hwe-16.04-lowlatency-edge)",
              ],
            ],
          },
        ],
      }),
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loading: false,
          loaded: true,
          data: osInfoFactory(),
        }),
      }),
    });
  });

  it("dispatched an action to update config on save button click", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CommissioningForm />
      </Provider>
    );
    const form: TSFixMe = wrapper.find("Formik");
    form.props().onSubmit(
      {
        commissioning_distro_series: "bionic",
        default_min_hwe_kernel: "ga-16.04-lowlatency",
        maas_auto_ipmi_user: "maas",
        maas_auto_ipmi_k_g_bmc_key: "password",
        maas_auto_ipmi_user_privilege_level: "USER",
      },
      { resetForm: jest.fn() }
    );

    const updateConfigAction = store
      .getActions()
      .find((action) => action.type === "UPDATE_CONFIG");
    expect(updateConfigAction).toEqual({
      type: "UPDATE_CONFIG",
      payload: {
        params: [
          { name: "commissioning_distro_series", value: "bionic" },
          { name: "default_min_hwe_kernel", value: "ga-16.04-lowlatency" },
          { name: "maas_auto_ipmi_user", value: "maas" },
          { name: "maas_auto_ipmi_k_g_bmc_key", value: "password" },
          { name: "maas_auto_ipmi_user_privilege_level", value: "USER" },
        ],
      },
      meta: {
        model: "config",
        method: "update",
      },
    });
  });
});
