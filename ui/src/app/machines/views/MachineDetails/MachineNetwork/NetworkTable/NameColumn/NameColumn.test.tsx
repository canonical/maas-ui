import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NameColumn from "./NameColumn";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NameColumn", () => {
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

  it("disables the checkboxes when networking is disabled", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        status: NodeStatus.COMMISSIONING,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NameColumn
          handleRowCheckbox={jest.fn()}
          nic={nic}
          selected={[]}
          showCheckbox={true}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("RowCheckbox").prop("disabled")).toBe(true);
  });

  it("can not show a checkbox", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        status: NodeStatus.COMMISSIONING,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NameColumn
          handleRowCheckbox={jest.fn()}
          nic={nic}
          selected={[]}
          showCheckbox={false}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("RowCheckbox").exists()).toBe(false);
    expect(wrapper.find("span[data-test='name']").exists()).toBe(true);
  });
});
