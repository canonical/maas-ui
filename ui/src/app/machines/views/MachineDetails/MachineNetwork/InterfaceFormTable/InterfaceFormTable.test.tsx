import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import InterfaceFormTable from "./InterfaceFormTable";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("InterfaceFormTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
        loaded: true,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <InterfaceFormTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a table when loaded", () => {
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <InterfaceFormTable nicId={nic.id} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });
});
