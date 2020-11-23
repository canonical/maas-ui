import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import PowerColumn from "./PowerColumn";

import {
  machine as machineFactory,
  pod as podFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("PowerColumn", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  it(`shows a spinner if machines/controllers are loading and pod's host is not
    yet in state`, () => {
    const state = { ...initialState };
    state.machine.loading = true;
    state.pod.items = [podFactory({ host: "abc123", id: 1, name: "pod-1" })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerColumn id={1} />
      </Provider>
    );

    expect(wrapper.find(".p-icon--spinner").exists()).toBe(true);
  });

  it("can display the pod's host power information", () => {
    const state = { ...initialState };
    const machine = machineFactory();
    machine.power_state = "on";
    machine.system_id = "abc123";
    state.machine.items = [machine];
    state.pod.items = [podFactory({ host: "abc123", id: 1, name: "pod-1" })];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <PowerColumn id={1} />
      </Provider>
    );

    expect(wrapper.find("[data-test='pod-power']").text()).toBe("On");
    expect(wrapper.find("i").props().className).toBe("p-icon--power-on");
  });

  it("displays 'Unknown' if pod's host cannot be found", () => {
    const state = { ...initialState };
    const machine = machineFactory();
    machine.power_state = "on";
    machine.system_id = "abc123";
    state.machine.items = [machine];
    state.pod.items = [podFactory({ host: "def456", id: 1, name: "pod-1" })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerColumn id={1} />
      </Provider>
    );

    expect(wrapper.find("[data-test='pod-power']").text()).toBe("Unknown");
    expect(wrapper.find("i").props().className).toBe("p-icon--power-unknown");
  });
});
