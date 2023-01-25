import NetworkTable, { Label } from "./NetworkTable";

import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import { Label as PXEColumnLabel } from "app/base/components/node/networking/NetworkTable/PXEColumn/PXEColumn";
import { Label as NetworkTableActionsLabel } from "app/machines/views/MachineDetails/MachineNetwork/NetworkTable/NetworkTableActions/NetworkTableActions";
import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  controllerDetails as controllerDetailsFactory,
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
import {
  userEvent,
  screen,
  within,
  renderWithBrowserRouter,
} from "testing/utils";

describe("NetworkTable", () => {
  let state: RootState;
  let machine: MachineDetails;
  beforeEach(() => {
    machine = machineDetailsFactory({ system_id: "abc123" });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [machine],
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
    machine = machineDetailsFactory({
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
    state.machine.items = [machine];
    renderWithBrowserRouter(
      <NetworkTable
        expanded={null}
        node={machine}
        selected={[]}
        setExpanded={jest.fn()}
        setSelected={jest.fn()}
      />,
      { state }
    );
    const subnetCol = screen.getByRole("gridcell", { name: Label.Subnet });
    const subnetPrimary = within(subnetCol).getByTestId("primary");
    expect(within(subnetPrimary).getByText("Unconfigured")).toBeInTheDocument();
    const ipCol = screen.getByRole("gridcell", { name: Label.IP });
    const ipPrimary = within(ipCol).getByTestId("primary");
    expect(within(ipPrimary).getByText("Unconfigured")).toBeInTheDocument();
  });

  it("can display an interface that has a link", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.subnet.items = [subnet];
    machine = machineDetailsFactory({
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
    state.machine.items = [machine];
    renderWithBrowserRouter(
      <NetworkTable
        expanded={null}
        node={machine}
        selected={[]}
        setExpanded={jest.fn()}
        setSelected={jest.fn()}
      />,
      { state }
    );
    const subnetCol = screen.getByRole("gridcell", { name: Label.Subnet });
    expect(
      within(subnetCol).getByRole("link", { name: "subnet-cidr" })
    ).toBeInTheDocument();
    const ipCol = screen.getByRole("gridcell", { name: Label.IP });
    const ipPrimary = within(ipCol).getByTestId("primary");
    expect(within(ipPrimary).getByText("1.2.3.99")).toBeInTheDocument();
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
    machine = machineDetailsFactory({
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
    state.machine.items = [machine];
    renderWithBrowserRouter(
      <NetworkTable
        expanded={null}
        node={machine}
        selected={[]}
        setExpanded={jest.fn()}
        setSelected={jest.fn()}
      />,
      { state }
    );
    const alias = screen.getByTestId("alias:1");
    expect(alias).toBeInTheDocument();
    const subnetCol = within(alias).getByRole("gridcell", {
      name: Label.Subnet,
    });
    expect(
      within(subnetCol).getByRole("link", { name: "subnet2-cidr" })
    ).toBeInTheDocument();
    const ipCol = within(alias).getByRole("gridcell", { name: Label.IP });
    const ipPrimary = within(ipCol).getByTestId("primary");
    expect(within(ipPrimary).getByText("1.2.3.101")).toBeInTheDocument();
  });

  it("expands a row when a matching link is found", () => {
    machine = machineDetailsFactory({
      interfaces: [
        machineInterfaceFactory({
          discovered: null,
          links: [networkLinkFactory(), networkLinkFactory({ id: 2 })],
          name: "alias",
          type: NetworkInterfaceTypes.ALIAS,
        }),
      ],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithBrowserRouter(
      <NetworkTable
        expanded={{ content: ExpandedState.REMOVE, linkId: 2 }}
        node={machine}
        selected={[]}
        setExpanded={jest.fn()}
        setSelected={jest.fn()}
      />,
      { state }
    );
    const alias = screen.getByTestId("alias:1");
    expect(alias.className.includes("is-active")).toBe(true);
  });

  it("expands a row when a matching nic is found", () => {
    machine = machineDetailsFactory({
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
    });
    state.machine.items = [machine];
    renderWithBrowserRouter(
      <NetworkTable
        expanded={{ content: ExpandedState.REMOVE, nicId: 2 }}
        node={machine}
        selected={[]}
        setExpanded={jest.fn()}
        setSelected={jest.fn()}
      />,
      { state }
    );
    const alias = screen.getByTestId("eth0");
    expect(alias.className.includes("is-active")).toBe(true);
  });

  it("displays actions", () => {
    machine = machineDetailsFactory({
      interfaces: [
        machineInterfaceFactory({
          id: 100,
          is_boot: false,
          name: "bond0",
          parents: [101],
          type: NetworkInterfaceTypes.BOND,
        }),
        machineInterfaceFactory({
          id: 101,
          children: [100],
          is_boot: true,
          name: "eth0",
          type: NetworkInterfaceTypes.PHYSICAL,
        }),
        machineInterfaceFactory({
          id: 102,
          name: "eth1",
          type: NetworkInterfaceTypes.PHYSICAL,
        }),
      ],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithBrowserRouter(
      <NetworkTable
        expanded={null}
        node={machine}
        selected={[]}
        setExpanded={jest.fn()}
        setSelected={jest.fn()}
      />,
      { state }
    );
    expect(
      screen.getByRole("grid").className.includes("network-table--has-actions")
    ).toBe(true);
    // The check-all checkbox should be in the header.
    expect(
      within(screen.getByRole("columnheader", { name: Label.Name })).getByRole(
        "checkbox"
      )
    ).toBeInTheDocument();
    // There should be a checkbox for the child interface.
    expect(
      within(screen.getByTestId("bond0")).getByRole("checkbox")
    ).toBeInTheDocument();
    // There should be a checkbox for the physical nic.
    const nic = screen.getByTestId("eth1");
    expect(within(nic).getByRole("checkbox")).toBeInTheDocument();
    // There should be an actions menu for the physical nic.
    expect(
      within(nic).getByLabelText(NetworkTableActionsLabel.Title)
    ).toBeInTheDocument();
  });

  it("can display without actions", () => {
    const controller = controllerDetailsFactory({
      interfaces: [
        machineInterfaceFactory({
          id: 100,
          is_boot: false,
          name: "bond0",
          parents: [101],
          type: NetworkInterfaceTypes.BOND,
        }),
        machineInterfaceFactory({
          id: 101,
          children: [100],
          is_boot: true,
          name: "eth0",
          type: NetworkInterfaceTypes.PHYSICAL,
        }),
        machineInterfaceFactory({
          id: 102,
          name: "eth1",
          type: NetworkInterfaceTypes.PHYSICAL,
        }),
      ],
      system_id: "abc123",
    });
    state.controller.items = [controller];
    renderWithBrowserRouter(<NetworkTable node={controller} />, {
      state,
    });
    expect(
      screen.getByRole("grid").className.includes("network-table--has-actions")
    ).toBe(false);
    // The check-all checkbox should not be in the header.
    const header = screen.getByRole("columnheader", { name: Label.Name });
    expect(within(header).queryByRole("checkbox")).not.toBeInTheDocument();
    // There should not be a checkbox for the child interface.
    const bond = screen.getByTestId("bond0");
    expect(within(bond).queryByRole("checkbox")).not.toBeInTheDocument();
    // There should not be a checkbox for the physical nic.
    const nic = screen.getByTestId("eth1");
    expect(within(nic).queryByRole("checkbox")).not.toBeInTheDocument();
    // There should not be an actions menu for the physical nic.
    expect(
      within(nic).queryByLabelText(NetworkTableActionsLabel.Title)
    ).not.toBeInTheDocument();
  });

  describe("bond and bridge interfaces", () => {
    beforeEach(() => {
      machine = machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            id: 100,
            is_boot: false,
            name: "bond0",
            parents: [101],
            type: NetworkInterfaceTypes.BOND,
          }),
          machineInterfaceFactory({
            id: 101,
            children: [100],
            is_boot: true,
            name: "eth0",
            type: NetworkInterfaceTypes.PHYSICAL,
          }),
        ],
        system_id: "abc123",
      });
      state.machine.items = [machine];
    });

    it("does not display a checkbox for parent interfaces", () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );
      // There should be one checkbox for the child interface.
      expect(
        within(screen.getByTestId("bond0")).getByRole("checkbox")
      ).toBeInTheDocument();
      const nic = screen.getByTestId("eth0");
      expect(within(nic).queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("does not include parent interfaces in the GroupCheckbox", async () => {
      const setSelected = jest.fn();
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={setSelected}
        />,
        { state }
      );
      await userEvent.click(
        within(
          screen.getByRole("columnheader", { name: Label.Name })
        ).getByRole("checkbox")
      );
      expect(setSelected).toHaveBeenCalledWith([
        { linkId: undefined, nicId: 100 },
      ]);
    });

    it("does not display a boot icon for parent interfaces", () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );
      const row = screen.getByTestId("eth0");
      expect(
        within(row).queryByLabelText(PXEColumnLabel.IsBoot)
      ).not.toBeInTheDocument();
    });

    it("does not display a fabric column for parent interfaces", () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );
      const row = screen.getByTestId("eth0");
      expect(
        within(row).queryByRole("gridcell", {
          name: Label.Fabric,
        })?.textContent
      ).toBeFalsy();
    });

    it("does not display a DHCP column for parent interfaces", () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );
      const row = screen.getByTestId("eth0");
      expect(
        within(row).queryByRole("gridcell", {
          name: Label.DHCP,
        })?.textContent
      ).toBeFalsy();
    });

    it("does not display a subnet column for parent interfaces", () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );
      const row = screen.getByTestId("eth0");
      expect(
        within(row).queryByRole("gridcell", {
          name: Label.Subnet,
        })?.textContent
      ).toBeFalsy();
    });

    it("does not display an IP column for parent interfaces", () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );
      const row = screen.getByTestId("eth0");
      expect(
        within(row).queryByRole("gridcell", {
          name: Label.IP,
        })?.textContent
      ).toBeFalsy();
    });

    it("does not display an actions menu for parent interfaces", () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );
      const row = screen.getByTestId("eth0");
      expect(
        within(row).queryByLabelText(NetworkTableActionsLabel.Title)
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    beforeEach(() => {
      machine = machineDetailsFactory({
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
    });

    it("groups the bonds and bridges", () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );
      const names = screen
        .getAllByRole("row")
        .map((row) => row.getAttribute("data-testid"))
        // Remove the header.
        .filter(Boolean);
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

    it("groups the bonds and bridges when in reverse order", async () => {
      renderWithBrowserRouter(
        <NetworkTable
          expanded={null}
          node={machine}
          selected={[]}
          setExpanded={jest.fn()}
          setSelected={jest.fn()}
        />,
        { state }
      );

      await userEvent.click(
        within(
          screen.getByRole("columnheader", { name: Label.Name })
        ).getByRole("button", { name: Label.Name })
      );
      const names = screen
        .getAllByRole("row")
        .map((row) => row.getAttribute("data-testid"))
        // Remove the header.
        .filter(Boolean);
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
