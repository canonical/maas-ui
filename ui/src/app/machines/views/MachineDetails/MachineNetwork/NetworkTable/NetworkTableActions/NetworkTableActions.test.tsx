import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NetworkTableActions from "./NetworkTableActions";

import type { NetworkInterface } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineInterface as machineInterfaceFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkTableActions", () => {
  let nic: NetworkInterface;
  let state: RootState;
  beforeEach(() => {
    nic = machineInterfaceFactory();
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("can display the menu", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("TableMenu").exists()).toBe(true);
    expect(wrapper.find("TableMenu").prop("disabled")).toBe(false);
  });

  it("disables menu when networking is disabled and limited editing is not allowed", () => {
    state.machine.items[0].permissions = [];
    state.machine.items[0].status = NodeStatus.NEW;
    nic.type = NetworkInterfaceTypes.VLAN;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("TableMenu").prop("disabled")).toBe(true);
  });
});
