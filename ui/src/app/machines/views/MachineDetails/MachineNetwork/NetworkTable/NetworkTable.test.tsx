import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NetworkTable from "./NetworkTable";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
      }),
      vlan: vlanStateFactory({
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

  it("does not display the dhcp column if the data is loading", () => {
    state.fabric.loaded = false;
    state.vlan.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("DoubleRow[data-test='dhcp']").exists()).toBe(false);
  });

  it("can display the dhcp status", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({
      fabric: fabric.id,
      vid: 2,
      name: "vlan-name",
      external_dhcp: null,
      dhcp_on: true,
    });
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
    expect(wrapper.find("DoubleRow[data-test='dhcp']").prop("primary")).toBe(
      "MAAS-provided"
    );
  });

  it("can display an icon if the vlan is relayed", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({
      fabric: fabric.id,
      vid: 2,
      name: "vlan-name",
      relay_vlan: 3,
    });
    state.vlan.items = [vlan, vlanFactory({ fabric: 1, id: 3 })];
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
    expect(wrapper.find("DoubleRow[data-test='dhcp'] Icon").exists()).toBe(
      true
    );
  });

  it("can display a boot icon", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            is_boot: true,
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
    expect(wrapper.find("Icon[name='success']").exists()).toBe(true);
  });

  it("can display an interface that has no links", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnets = [
      subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" }),
      subnetFactory({ cidr: "subnet2-cidr", name: "subnet2-name" }),
    ];
    state.subnet.items = subnets;
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            discovered: null,
            links: [],
            type: NetworkInterfaceTypes.BOND,
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
    expect(wrapper.find("SubnetColumn DoubleRow").prop("primary")).toBe(
      "Unconfigured"
    );
    expect(wrapper.find("IPColumn DoubleRow").prop("primary")).toBe(
      "Unconfigured"
    );
  });

  it("can display an interface that has a link", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.subnet.items = [subnet];
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            discovered: null,
            links: [
              networkLinkFactory({
                subnet_id: subnet.id,
                ip_address: "1.2.3.99",
              }),
            ],
            type: NetworkInterfaceTypes.BOND,
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
    expect(wrapper.find("SubnetColumn LegacyLink").at(0).text()).toBe(
      "subnet-cidr"
    );
    expect(wrapper.find("IPColumn DoubleRow").prop("primary")).toBe("1.2.3.99");
  });

  it("can display an interface that is an alias", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnets = [
      subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" }),
      subnetFactory({ cidr: "subnet2-cidr", name: "subnet2-name" }),
    ];
    state.subnet.items = subnets;
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            discovered: null,
            links: [
              networkLinkFactory({
                subnet_id: subnets[0].id,
                ip_address: "1.2.3.99",
              }),
              networkLinkFactory({
                subnet_id: subnets[1].id,
                ip_address: "1.2.3.101",
              }),
            ],
            name: "alias",
            type: NetworkInterfaceTypes.BOND,
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
    const alias = wrapper.findWhere(
      (n) => n.name() === "TableRow" && n.key() === "alias:1"
    );
    expect(alias.exists()).toBe(true);
    expect(alias.find("SubnetColumn LegacyLink").at(0).text()).toBe(
      "subnet2-cidr"
    );
    expect(alias.find("IPColumn DoubleRow").prop("primary")).toBe("1.2.3.101");
  });

  describe("member interfaces", () => {
    beforeEach(() => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 100,
              is_boot: false,
              parents: [101],
              type: NetworkInterfaceTypes.BOND,
            }),
            machineInterfaceFactory({
              id: 101,
              children: [100],
              is_boot: true,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
    });

    it("does not display a boot icon for member interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable systemId="abc123" />
        </Provider>
      );
      expect(wrapper.find("Icon[name='success']").length).toBe(1);
    });

    it("display the full type for member interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable systemId="abc123" />
        </Provider>
      );
      expect(
        wrapper.find("DoubleRow[data-test='type']").at(0).prop("primary")
      ).toBe("Bonded physical");
    });

    it("does not display a fabric column for member interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable systemId="abc123" />
        </Provider>
      );
      expect(wrapper.find("DoubleRow[data-test='fabric']").length).toBe(1);
    });

    it("does not display a DHCP column for member interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable systemId="abc123" />
        </Provider>
      );
      expect(wrapper.find("DoubleRow[data-test='dhcp']").length).toBe(1);
    });

    it("does not display a subnet column for member interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable systemId="abc123" />
        </Provider>
      );
      expect(wrapper.find("SubnetColumn").length).toBe(1);
    });

    it("does not display an IP column for member interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable systemId="abc123" />
        </Provider>
      );
      expect(wrapper.find("IPColumn").length).toBe(1);
    });

    it("does not display an actions menu for member interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable systemId="abc123" />
        </Provider>
      );
      expect(wrapper.find("NetworkTableActions").length).toBe(1);
    });
  });
});
