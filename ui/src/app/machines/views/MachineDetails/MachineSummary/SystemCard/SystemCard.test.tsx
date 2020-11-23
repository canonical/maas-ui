import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SystemCard from "./SystemCard";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("SystemCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("renders with system data", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SystemCard id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SystemCard")).toMatchSnapshot();
  });

  it("renders when system data is not available", () => {
    state.machine.items = [
      machineDetailsFactory({ system_id: "abc123", metadata: {} }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SystemCard id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("ul .p-list__item-value")
        .everyWhere((item) => !item.text() || item.text() === "Unknown")
    ).toBe(true);
  });
});
