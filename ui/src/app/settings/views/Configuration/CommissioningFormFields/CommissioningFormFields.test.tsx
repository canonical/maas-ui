import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CommissioningForm from "../CommissioningForm";

import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("CommissioningFormFields", () => {
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
          },
          {
            name: "maas_auto_ipmi_user",
            value: "maas",
          },
          {
            name: "maas_auto_ipmi_user_privilege_level",
            value: "OPERATOR",
          },
        ],
      }),
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: true,
          loading: false,
          data: osInfoFactory({
            kernels: {
              ubuntu: {
                trusty: [
                  ["hwe-14.04-edge", "xenial (hwe-14.04-edge)"],
                  ["hwe-14.04", "trusty (hwe-14.04)"],
                ],
                xenial: [
                  ["hwe-16.04-edge", "xenial (hwe-16.04-edge)"],
                  ["hwe-16.04", "xenial (hwe-16.04)"],
                ],
                bionic: [
                  ["hwe-18.04-edge", "xenial (hwe-18.04-edge)"],
                  ["hwe-18.04", "xenial (hwe-18.04)"],
                ],
              },
            },
          }),
        }),
      }),
    });
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

  it("updates value for ipmi username", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <CommissioningForm />
      </Provider>
    );

    expect(
      wrapper.find("input[name='maas_auto_ipmi_user']").props().value
    ).toBe("maas");
  });

  it("updates value for ipmi user privilege level", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <CommissioningForm />
      </Provider>
    );

    expect(
      wrapper
        .find("input[name='maas_auto_ipmi_user_privilege_level'][checked=true]")
        .props().value
    ).toBe("OPERATOR");
  });
});
