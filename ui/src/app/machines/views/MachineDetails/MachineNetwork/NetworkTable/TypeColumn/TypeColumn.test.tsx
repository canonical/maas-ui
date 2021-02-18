import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import TypeColumn from "./TypeColumn";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("TypeColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  it("displays an icon when bond is over multiple numa nodes", () => {
    const interfaces = [machineInterfaceFactory({ numa_node: 1 })];
    const nic = machineInterfaceFactory({
      numa_node: 2,
      parents: [interfaces[0].id],
    });
    interfaces.push(nic);
    state.machine.items = [
      machineDetailsFactory({
        interfaces,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <TypeColumn nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow").exists()).toBe(true);
    expect(wrapper.find("DoubleRow Icon").exists()).toBe(true);
  });

  it("does not display an icon for single numa nodes", () => {
    const nic = machineInterfaceFactory({
      numa_node: 2,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <TypeColumn nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow").exists()).toBe(true);
    expect(wrapper.find("DoubleRow Icon").exists()).toBe(false);
  });

  it("displays the full type for parent interfaces", () => {
    const interfaces = [
      machineInterfaceFactory({ type: NetworkInterfaceTypes.BOND }),
    ];
    const nic = machineInterfaceFactory({
      children: [interfaces[0].id],
    });
    interfaces.push(nic);
    state.machine.items = [
      machineDetailsFactory({
        interfaces,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <TypeColumn nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow").prop("primary")).toBe("Bonded physical");
  });
});
