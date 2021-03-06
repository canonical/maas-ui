import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import BondForm from "./BondForm";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("BondForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
      vlan: vlanStateFactory({
        items: [
          vlanFactory({
            id: 1,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a table", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <BondForm
            close={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    const table = wrapper.find("InterfaceFormTable");
    expect(table.exists()).toBe(true);
  });

  it("displays the selected interfaces when not editing members", () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces,
      }),
    ];
    const store = mockStore(state);
    const selected = [{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <BondForm
            close={jest.fn()}
            selected={selected}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("InterfaceFormTable").prop("interfaces")).toStrictEqual(
      selected
    );
  });

  it("displays all valid interfaces when editing members", () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      // VLANs are not valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
        vlan_id: 1,
      }),
      // Bridges are not valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.BRIDGE,
        vlan_id: 1,
      }),
      // Bonds are not valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.BOND,
        vlan_id: 1,
      }),
      // Physical interfaces in other VLANs are not valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 2,
      }),
      // Physical interfaces in the same VLAN are valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces,
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <BondForm
            close={jest.fn()}
            selected={[
              { nicId: interfaces[0].id },
              { nicId: interfaces[1].id },
            ]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("button[data-test='edit-members']").simulate("click");
    wrapper.update();
    expect(wrapper.find("InterfaceFormTable").prop("interfaces")).toStrictEqual(
      [
        { linkId: undefined, nicId: interfaces[0].id },
        { linkId: undefined, nicId: interfaces[1].id },
        { linkId: undefined, nicId: interfaces[6].id },
      ]
    );
  });

  it("disables the edit button if there are no additional valid interfaces", () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces,
      }),
    ];
    const store = mockStore(state);
    const selected = [{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <BondForm
            close={jest.fn()}
            selected={selected}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("Button[data-test='edit-members']").prop("disabled")
    ).toBe(true);
  });

  it("disables the update button if two interfaces aren't selected", () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces,
      }),
    ];
    const store = mockStore(state);
    // Use a component to pass props to the form so that setProps can be used
    // below.
    const PassthroughComponent = ({ ...props }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <BondForm
            close={jest.fn()}
            selected={[
              { nicId: interfaces[0].id },
              { nicId: interfaces[1].id },
            ]}
            setSelected={jest.fn()}
            systemId="abc123"
            {...props}
          />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<PassthroughComponent />);
    wrapper.find("button[data-test='edit-members']").simulate("click");
    wrapper.update();
    wrapper.setProps({ selected: [] });
    wrapper.update();
    expect(
      wrapper.find("Button[data-test='edit-members']").prop("disabled")
    ).toBe(true);
  });
});
