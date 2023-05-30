import CloneNetworkTable from "./CloneNetworkTable";

import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
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
import { renderWithMockStore, screen, within } from "testing/utils";

describe("CloneNetworkTable", () => {
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

  it("renders empty table if neither loading machine nor machine provided", () => {
    renderWithMockStore(<CloneNetworkTable machine={null} selected={false} />, {
      state,
    });
    expect(screen.getAllByRole("row")).toHaveLength(1);
    // expect(wrapper.find("MainTable").prop("rows")).toStrictEqual([]);
    // expect(wrapper.find("Placeholder").exists()).toBe(false);
  });

  it("renders placeholder content while details are loading", () => {
    renderWithMockStore(
      <CloneNetworkTable
        loadingMachineDetails
        machine={null}
        selected={false}
      />,
      {
        state,
      }
    );
    const rows = screen.getAllByRole("row");
    rows.shift(); // Remove the table header row
    rows.forEach((row) => {
      const placeholders = within(row).getAllByTestId("placeholder");
      expect(placeholders[0]).toHaveTextContent("Name");
      expect(placeholders[1]).toHaveTextContent("Subnet");
      expect(placeholders[2]).toHaveTextContent("Fabric name");
      expect(placeholders[3]).toHaveTextContent("VLAN");
      expect(placeholders[4]).toHaveTextContent("Disk type");
      expect(placeholders[5]).toHaveTextContent("X, X");
      expect(placeholders[6]).toHaveTextContent("DHCP");
    });
  });

  it("renders machine network details if machine is provided", () => {
    const machine = machineDetailsFactory({
      interfaces: [machineInterfaceFactory()],
    });

    renderWithMockStore(
      <CloneNetworkTable machine={machine} selected={false} />,
      {
        state,
      }
    );

    expect(screen.queryByTestId("placeholder")).not.toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  it("can display an interface that has no links", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnets = [
      subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" }),
      subnetFactory({ cidr: "subnet2-cidr", name: "subnet2-name" }),
    ];
    const machine = machineDetailsFactory({
      interfaces: [
        machineInterfaceFactory({
          discovered: null,
          links: [],
          type: NetworkInterfaceTypes.BOND,
          vlan_id: vlan.id,
        }),
      ],
      system_id: "abc123",
    });
    state.fabric.items = [fabric];
    state.machine.items = [machine];
    state.subnet.items = subnets;
    state.vlan.items = [vlan];
    renderWithMockStore(<CloneNetworkTable machine={machine} selected />, {
      state,
    });
    expect(
      within(screen.getByTestId("name-subnet")).getByTestId("secondary")
    ).toHaveTextContent("Unconfigured");
  });

  it("can display an interface that has a link", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    const machine = machineDetailsFactory({
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
    });
    state.fabric.items = [fabric];
    state.machine.items = [machine];
    state.subnet.items = [subnet];
    state.vlan.items = [vlan];
    renderWithMockStore(<CloneNetworkTable machine={machine} selected />, {
      state,
    });
    expect(
      within(screen.getByTestId("name-subnet")).getByTestId("secondary")
    ).toHaveTextContent("subnet-cidr");
  });

  it("can display an interface that is an alias", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    const subnets = [
      subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" }),
      subnetFactory({ cidr: "subnet2-cidr", name: "subnet2-name" }),
    ];
    const machine = machineDetailsFactory({
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
    });
    state.fabric.items = [fabric];
    state.machine.items = [machine];
    state.subnet.items = subnets;
    state.vlan.items = [vlan];
    renderWithMockStore(<CloneNetworkTable machine={machine} selected />, {
      state,
    });
    const row = screen.getAllByTestId("name-subnet")[1];
    expect(within(row).getByTestId("primary")).toHaveTextContent("alias:1");
    expect(within(row).getByTestId("secondary")).toHaveTextContent(
      "subnet2-cidr"
    );
  });

  it("groups bonds and bridges with their parent interfaces", () => {
    const machine = machineDetailsFactory({
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
    });
    state.machine.items = [machine];
    renderWithMockStore(<CloneNetworkTable machine={machine} selected />, {
      state,
    });
    const names = screen
      .getAllByTestId("name-subnet")
      .map((doubleRow) => within(doubleRow).getByTestId("primary").textContent);
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
});
