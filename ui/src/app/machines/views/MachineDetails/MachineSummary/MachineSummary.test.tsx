import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineSummary from "./MachineSummary";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineSummary", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner if machines are loading", () => {
    state.machine.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineSummary setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineSummary setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MachineSummary")).toMatchSnapshot();
  });
});
