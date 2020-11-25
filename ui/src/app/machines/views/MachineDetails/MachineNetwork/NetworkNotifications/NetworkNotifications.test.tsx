import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NetworkNotifications from "./NetworkNotifications";

import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkNotifications", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64"],
          loaded: true,
        }),
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            architecture: "amd64",
            events: [machineEventFactory()],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("handles no notifications", () => {
    state.machine.items = [
      machineDetailsFactory({
        on_network: true,
        osystem: "ubuntu",
        status: NodeStatus.NEW,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(false);
  });

  it("can show a network connection message", () => {
    state.machine.items = [
      machineDetailsFactory({
        on_network: false,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("Machine must be connected to a network.")
        )
        .exists()
    ).toBe(true);
  });

  it("can show a permissions message", () => {
    state.machine.items[0].status = NodeStatus.DEPLOYING;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("Interface configuration cannot be modified")
        )
        .exists()
    ).toBe(true);
  });

  it("can display a custom image message", () => {
    state.machine.items[0].osystem = "custom";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("Custom images may require special preparation")
        )
        .exists()
    ).toBe(true);
  });
});
