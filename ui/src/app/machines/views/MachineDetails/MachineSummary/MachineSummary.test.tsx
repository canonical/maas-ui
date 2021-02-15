import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineSummary from "./MachineSummary";

import { nodeStatus } from "app/base/enum";
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

  it("shows workload annotations for deployed machines", () => {
    state.machine.items = [
      machineFactory({ status_code: nodeStatus.DEPLOYED, system_id: "abc123" }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/summary"
            component={() => <MachineSummary setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("WorkloadCard").exists()).toBe(true);
  });

  it("shows workload annotations for allocated machines", () => {
    state.machine.items = [
      machineFactory({
        status_code: nodeStatus.ALLOCATED,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/summary"
            component={() => <MachineSummary setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("WorkloadCard").exists()).toBe(true);
  });

  it("does not show workload annotations for machines that are neither deployed nor allocated", () => {
    state.machine.items = [
      machineFactory({ status_code: nodeStatus.NEW, system_id: "abc123" }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/summary"
            component={() => <MachineSummary setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("WorkloadCard").exists()).toBe(false);
  });
});
