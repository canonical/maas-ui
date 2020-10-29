import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import MachineNotifications from "./MachineNotifications";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("MachineNotifications", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64"],
        }),
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({
            architecture: "amd64",
            events: [machineEventFactory()],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("handles no notifications", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <MachineNotifications />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(false);
  });

  it("can display a power error", () => {
    state.machine.items[0].power_state = "error";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <MachineNotifications />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n
              .text()
              .includes("Script - smartctl-validate on name-VZJoCN timed out")
        )
        .exists()
    ).toBe(true);
  });

  it("can display a rack connection error", () => {
    state.general.powerTypes.data = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <MachineNotifications />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("no rack controller is currently connected")
        )
        .exists()
    ).toBe(true);
  });

  it("can display an architecture error", () => {
    state.machine.items[0].architecture = "";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <MachineNotifications />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n
              .text()
              .includes("This machine currently has an invalid architecture")
        )
        .exists()
    ).toBe(true);
  });

  it("can display a boot images error", () => {
    state.general.architectures = architecturesStateFactory({
      data: [],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <MachineNotifications />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("No boot images have been imported")
        )
        .exists()
    ).toBe(true);
  });

  it("can display a hardware error", () => {
    state.machine.items[0].cpu_count = 0;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <MachineNotifications />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("Commission this machine to get CPU")
        )
        .exists()
    ).toBe(true);
  });
});
