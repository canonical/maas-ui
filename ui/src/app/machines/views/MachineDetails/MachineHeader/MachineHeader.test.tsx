import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import {
  machineDetails as machineDetailsFactory,
  machineDevice as machineDeviceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import MachineHeader from "./MachineHeader";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("MachineHeader", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays an icon when locked", () => {
    state.machine.items[0].locked = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere((n) => n.name() === "Icon" && n.prop("name") === "locked")
        .exists()
    ).toBe(true);
  });

  it("displays power status", () => {
    state.machine.items[0].power_state = "on";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-icon--power-on").exists()).toBe(true);
    expect(wrapper.find("[data-test='machine-header-power']").text()).toBe(
      "Power on"
    );
  });

  it("displays power status when checking power", () => {
    state.machine.statuses["abc123"] = machineStatusFactory({
      checkingPower: true,
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
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-icon--power-checking").exists()).toBe(true);
    expect(wrapper.find("[data-test='machine-header-power']").text()).toBe(
      "Checking power"
    );
  });

  it("includes a tab for instances if machine has any", () => {
    state.machine.items[0] = machineDetailsFactory({
      devices: [machineDeviceFactory()],
      system_id: "abc123",
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
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-tabs__item").at(1).text()).toBe("Instances");
  });
});
