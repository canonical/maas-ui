import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NetworkTable from "./NetworkTable";
import { ExpandedState } from "./types";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
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
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
      subnet: subnetStateFactory({
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
        <NetworkTable
          expanded={null}
          setExpanded={jest.fn()}
          selected={[]}
          setSelected={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a table when loaded", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable
          expanded={null}
          setExpanded={jest.fn()}
          selected={[]}
          setSelected={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
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
        <NetworkTable
          expanded={null}
          setExpanded={jest.fn()}
          selected={[]}
          setSelected={jest.fn()}
          systemId="abc123"
        />
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
        <NetworkTable
          expanded={null}
          setExpanded={jest.fn()}
          selected={[]}
          setSelected={jest.fn()}
          systemId="abc123"
        />
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
            type: NetworkInterfaceTypes.ALIAS,
            vlan_id: vlan.id,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable
          expanded={null}
          setExpanded={jest.fn()}
          selected={[]}
          setSelected={jest.fn()}
          systemId="abc123"
        />
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

  it("expands a row when a matching link is found", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            discovered: null,
            links: [networkLinkFactory(), networkLinkFactory({ id: 2 })],
            name: "alias",
            type: NetworkInterfaceTypes.ALIAS,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable
          expanded={{ content: ExpandedState.REMOVE, linkId: 2 }}
          setExpanded={jest.fn()}
          selected={[]}
          setSelected={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    const row = wrapper.findWhere(
      (n) => n.name() === "TableRow" && n.key() === "alias:1"
    );
    expect(row.prop("className").includes("is-active")).toBe(true);
  });

  it("expands a row when a matching nic is found", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            id: 2,
            discovered: null,
            links: [],
            name: "eth0",
            type: NetworkInterfaceTypes.PHYSICAL,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable
          expanded={{ content: ExpandedState.REMOVE, nicId: 2 }}
          setExpanded={jest.fn()}
          selected={[]}
          setSelected={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    const row = wrapper.findWhere(
      (n) => n.name() === "TableRow" && n.key() === "eth0"
    );
    expect(row.prop("className").includes("is-active")).toBe(true);
  });

  describe("bond and bridge interfaces", () => {
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

    it("does not display a checkbox for parent interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      // There should be one checkbox for the child interface.
      expect(wrapper.find("RowCheckbox").length).toBe(1);
    });

    it("does not include parent interfaces in the GroupCheckbox", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      expect(wrapper.find("GroupCheckbox").prop("items")).toStrictEqual([100]);
    });

    it("does not display a boot icon for parent interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      expect(wrapper.find("Icon[name='tick']").length).toBe(1);
    });

    it("does not display a fabric column for parent interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      expect(wrapper.find("DoubleRow[data-test='fabric']").length).toBe(1);
    });

    it("does not display a DHCP column for parent interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      expect(wrapper.find("DoubleRow[data-test='dhcp']").length).toBe(1);
    });

    it("does not display a subnet column for parent interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      expect(wrapper.find("SubnetColumn").length).toBe(1);
    });

    it("does not display an IP column for parent interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      expect(wrapper.find("IPColumn").length).toBe(1);
    });

    it("does not display an actions menu for parent interfaces", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      expect(wrapper.find("NetworkTableActions").length).toBe(1);
    });
  });

  describe("sorting", () => {
    beforeEach(() => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 100,
              name: "bond0",
              parents: [101, 104],
              type: NetworkInterfaceTypes.BOND,
            }),
            machineInterfaceFactory({
              children: [100],
              id: 101,
              name: "eth0",
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            machineInterfaceFactory({
              id: 102,
              links: [networkLinkFactory(), networkLinkFactory()],
              name: "br0",
              parents: [103],
              type: NetworkInterfaceTypes.BRIDGE,
            }),
            machineInterfaceFactory({
              children: [102],
              id: 103,
              name: "eth1",
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            machineInterfaceFactory({
              id: 99,
              name: "eth2",
              parents: [],
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            machineInterfaceFactory({
              children: [100],
              id: 104,
              name: "eth3",
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
    });

    it("groups the bonds and bridges", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      const names = wrapper
        .find("[data-test='name']")
        .map((name) => name.text());
      expect(names).toStrictEqual([
        // Bond group:
        "bond0",
        "eth0", // bond parent
        "eth3", // bond parent
        // Bridge group:
        "br0",
        "eth1", // bridge parent
        // Alias:
        "br0:1",
        // Physical:
        "eth2",
      ]);
    });

    it("groups the bonds and bridges when in reverse order", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTable
            expanded={null}
            setExpanded={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      wrapper.find("TableHeader").first().find("button").simulate("click");
      const names = wrapper
        .find("[data-test='name']")
        .map((name) => name.text());
      expect(names).toStrictEqual([
        // Physical:
        "eth2",
        // Alias:
        "br0:1",
        // Bridge group:
        "br0",
        "eth1", // bridge parent
        // Bond group (parents inside bond are in reverse order):
        "bond0",
        "eth3", // bond parent
        "eth0", // bond parent
      ]);
    });
  });
});
