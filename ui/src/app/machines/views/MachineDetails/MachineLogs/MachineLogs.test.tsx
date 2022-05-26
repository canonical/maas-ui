import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineLogs from "./MachineLogs";

import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineLogs", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner if machine is loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineLogs systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  [
    {
      component: "InstallationOutput",
      path: machineURLs.machine.logs.installationOutput({ id: "abc123" }),
    },
    {
      component: "EventLogs",
      path: machineURLs.machine.logs.index({ id: "abc123" }),
    },
    {
      component: "EventLogs",
      path: machineURLs.machine.logs.events({ id: "abc123" }),
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <MachineLogs systemId="abc123" />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });

  it("can display the event logs", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/logs/events", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <MachineLogs systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("EventLogs").exists()).toBe(true);
  });
});
