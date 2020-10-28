import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import StatusCard from "./StatusCard";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("StatusCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
  });

  it("renders a locked machine and status", () => {
    const machine = machineDetailsFactory();
    machine.status = "Testing";
    machine.locked = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='locked']").text()).toEqual(
      "Locked: Testing"
    );
  });

  it("renders os info", () => {
    const machine = machineDetailsFactory();
    machine.osystem = "ubuntu";
    machine.distro_series = "focal";
    machine.show_os_info = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='os-info']").text()).toEqual(
      "ubuntu/focal"
    );
  });

  it("renders a failed test warning", () => {
    const machine = machineDetailsFactory();
    machine.testing_status.status = -1;

    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='failed-test-warning']").text()).toEqual(
      "Warning: Some tests failed, use with caution."
    );
  });
});
