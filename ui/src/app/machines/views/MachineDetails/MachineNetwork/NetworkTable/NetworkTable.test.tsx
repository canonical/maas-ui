import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NetworkTable from "./NetworkTable";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  networkDiscoveredIP as networkDiscoveredIPFactory,
  fabric as fabricFactory,
  vlan as vlanFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
      }),
    });
  });
  it("displays a spinner when loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a table when loading", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("can display a disconnected icon in the speed column", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            link_connected: false,
            type: NetworkInterfaceTypes.PHYSICAL,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("[data-test='speed'] Icon").prop("name")).toBe(
      "disconnected"
    );
  });

  it("can display a slow icon in the speed column", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            interface_speed: 2,
            link_speed: 1,
            link_connected: true,
            type: NetworkInterfaceTypes.PHYSICAL,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("[data-test='speed'] Icon").prop("name")).toBe(
      "warning"
    );
  });

  it("can display no icon in the speed column", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            link_connected: true,
            type: NetworkInterfaceTypes.PHYSICAL,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow[data-test='speed']").exists()).toBe(true);
    expect(wrapper.find("DoubleRow[data-test='speed'] Icon").exists()).toBe(
      false
    );
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
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow[data-test='type']").exists()).toBe(true);
    expect(wrapper.find("DoubleRow[data-test='type'] Icon").exists()).toBe(
      true
    );
  });

  it("does not display an icon for single numa nodes", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            numa_node: 2,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow[data-test='type']").exists()).toBe(true);
    expect(wrapper.find("DoubleRow[data-test='type'] Icon").exists()).toBe(
      false
    );
  });

  it("can display fabric and vlan details", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            vlan_id: vlan.id,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    const links = wrapper.find("DoubleRow[data-test='fabric'] LegacyLink");
    expect(links.at(0).text()).toBe("fabric-name");
    expect(links.at(1).text()).toBe("2 (vlan-name)");
  });

  it("can display subnet links", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.vlan.items = [vlan];
    state.subnet.items = [subnet];
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            discovered: null,
            links: [networkLinkFactory({ subnet_id: subnet.id })],
            vlan_id: vlan.id,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    const links = wrapper.find("DoubleRow[data-test='subnet'] LegacyLink");
    expect(links.at(0).text()).toBe("subnet-cidr");
    expect(links.at(1).text()).toBe("subnet-name");
  });

  it("can display an unconfigured subnet", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    state.subnet.items = [];
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            discovered: null,
            links: [networkLinkFactory({ subnet_id: 99 })],
            vlan_id: vlan.id,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow[data-test='subnet']").prop("primary")).toBe(
      "Unconfigured"
    );
  });

  it("can display the subnet name only", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.vlan.items = [vlan];
    state.subnet.items = [subnet];
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            discovered: [networkDiscoveredIPFactory({ subnet_id: subnet.id })],
            links: [],
            vlan_id: vlan.id,
          }),
        ],
        status: NodeStatus.DEPLOYING,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(
      wrapper.find("DoubleRow[data-test='subnet'] LegacyLink").exists()
    ).toBe(false);
    expect(wrapper.find("DoubleRow[data-test='subnet']").prop("primary")).toBe(
      "subnet-cidr (subnet-name)"
    );
  });
});
