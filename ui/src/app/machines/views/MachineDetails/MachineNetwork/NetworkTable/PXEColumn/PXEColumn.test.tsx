import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import PXEColumn from "./PXEColumn";

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

describe("PXEColumn", () => {
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

  it("can display a boot icon", () => {
    const nic = machineInterfaceFactory({
      is_boot: true,
      type: NetworkInterfaceTypes.PHYSICAL,
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
        <PXEColumn nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("Icon").exists()).toBe(true);
  });

  it("does not display an icon if it is not a boot interface", () => {
    const nic = machineInterfaceFactory({
      is_boot: false,
      type: NetworkInterfaceTypes.PHYSICAL,
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
        <PXEColumn nic={nic} systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("Icon").exists()).toBe(false);
  });
});
