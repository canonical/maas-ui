import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import AddMachineForm from "../AddMachineForm";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddMachineFormFields", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory()],
        loaded: true,
      }),
      general: generalStateFactory({
        architectures: {
          data: ["amd64/generic"],
          loaded: true,
        },
        defaultMinHweKernel: {
          data: "ga-16.04",
          loaded: true,
        },
        hweKernels: {
          data: [
            ["ga-16.04", "xenial (ga-16.04)"],
            ["ga-18.04", "bionic (ga-18.04)"],
          ],
          loaded: true,
        },
        powerTypes: {
          data: [
            {
              name: "manual",
              description: "Manual",
              fields: [],
            },
          ],
          loaded: true,
        },
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        items: [zoneFactory()],
        loaded: true,
      }),
    });
  });

  it("correctly sets minimum kernel to default", () => {
    const state = { ...initialState };
    state.general.defaultMinHweKernel.data = "ga-18.04";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Select[name='min_hwe_kernel']").props().value).toBe(
      "ga-18.04"
    );
  });

  it("can add extra mac address fields", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='extra-macs-0']").exists()).toBe(false);
    expect(wrapper.find("[data-test='extra-macs-1']").exists()).toBe(false);
    await act(async () => {
      wrapper.find("[data-test='add-extra-mac'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-test='extra-macs-0']").exists()).toBe(true);
    expect(wrapper.find("[data-test='extra-macs-1']").exists()).toBe(false);
    await act(async () => {
      wrapper.find("[data-test='add-extra-mac'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-test='extra-macs-0']").exists()).toBe(true);
    expect(wrapper.find("[data-test='extra-macs-1']").exists()).toBe(true);
  });

  it("can remove extra mac address fields", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      wrapper.find("[data-test='add-extra-mac'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-test='extra-macs-0']").exists()).toBe(true);
    await act(async () => {
      wrapper.find("[data-test='extra-macs-0'] button").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find("[data-test='extra-macs-0']").exists()).toBe(false);
  });

  it("does not require MAC address field if power_type is 'ipmi'", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachineForm />
        </MemoryRouter>
      </Provider>
    );
    // Power type is "manual" by default, therefore MAC address is required.
    expect(wrapper.find("Input[name='pxe_mac']").props().required).toBe(true);
    // Select the ipmi power type from the dropdown.
    await act(async () => {
      wrapper
        .find("select[name='power_type']")
        .props()
        .onChange({ target: { name: "power_type", value: "ipmi" } });
    });
    wrapper.update();
    // "ipmi" power type should not require MAC address.
    expect(wrapper.find("Input[name='pxe_mac']").props().required).toBe(false);
  });
});
