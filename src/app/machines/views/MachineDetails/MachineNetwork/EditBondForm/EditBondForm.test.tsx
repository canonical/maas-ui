import configureStore from "redux-mock-store";

import EditBondForm from "./EditBondForm";

import {
  BondLacpRate,
  BondMode,
  BondXmitHashPolicy,
} from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import {
  bondOptions as bondOptionsFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  subnet as subnetFactory,
  rootState as rootStateFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  within,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("EditBondForm", () => {
  let state: RootState;
  let nic: NetworkInterface;

  beforeEach(() => {
    nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.BOND,
      vlan_id: 1,
    });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
        items: [fabricFactory({ name: "test-fabric", id: 1 })],
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 1, name: "test-subnet-1", vlan: 1 })],
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [
          vlanFactory({
            id: 1,
            fabric: 1,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a table", () => {
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
    const selected = [{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }];
    renderWithBrowserRouter(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={selected}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("displays the selected interfaces when not editing members", () => {
    const interfaces = [
      machineInterfaceFactory({
        name: "eth0",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        name: "eth1",
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
    const selected = [{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }];
    renderWithBrowserRouter(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={selected}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByTestId("name")).toHaveTextContent("eth0");
    expect(within(rows[2]).getByTestId("name")).toHaveTextContent("eth1");
  });

  it("displays all valid interfaces when editing members", async () => {
    const interfaces = [
      machineInterfaceFactory({
        name: "valid0",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        name: "valid1",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      // VLANs are not valid.
      machineInterfaceFactory({
        name: "notvalid0",
        type: NetworkInterfaceTypes.VLAN,
        vlan_id: 1,
      }),
      // Bridges are not valid.
      machineInterfaceFactory({
        name: "notvalid1",
        type: NetworkInterfaceTypes.BRIDGE,
        vlan_id: 1,
      }),
      // Bonds are not valid.
      machineInterfaceFactory({
        name: "notvalid2",
        type: NetworkInterfaceTypes.BOND,
        vlan_id: 1,
      }),
      // Physical interfaces in other VLANs are not valid.
      machineInterfaceFactory({
        name: "notvalid3",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 2,
      }),
      // Physical interfaces in the same VLAN are valid.
      machineInterfaceFactory({
        name: "valid2",
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
    renderWithBrowserRouter(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={[{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    await userEvent.click(screen.getByTestId("edit-members"));

    const rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByTestId("name")).toHaveTextContent("valid0");
    expect(within(rows[2]).getByTestId("name")).toHaveTextContent("valid1");
    expect(within(rows[3]).getByTestId("name")).toHaveTextContent("valid2");

    expect(screen.queryByText("notvalid0")).not.toBeInTheDocument();
    expect(screen.queryByText("notvalid1")).not.toBeInTheDocument();
    expect(screen.queryByText("notvalid2")).not.toBeInTheDocument();
    expect(screen.queryByText("notvalid3")).not.toBeInTheDocument();
  });

  it("disables the submit button if two interfaces aren't selected", async () => {
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
    const { rerender } = renderWithBrowserRouter(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={[{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    expect(
      screen.getByRole("button", { name: "Save interface" })
    ).not.toBeDisabled();
    await userEvent.click(screen.getByTestId("edit-members"));
    rerender(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />
    );
    expect(
      screen.getByRole("button", { name: "Save interface" })
    ).toBeDisabled();
  });

  it("enables the submit button if only the members have changed", async () => {
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
    const { rerender } = renderWithBrowserRouter(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={[{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    expect(
      screen.getByRole("button", { name: "Save interface" })
    ).not.toBeDisabled();
    await userEvent.click(screen.getByTestId("edit-members"));
    // Select an extra interface.
    rerender(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={[
          { nicId: interfaces[0].id },
          { nicId: interfaces[1].id },
          { nicId: interfaces[2].id },
        ]}
        setSelected={jest.fn()}
        systemId="abc123"
      />
    );
    expect(
      screen.getByRole("button", { name: "Save interface" })
    ).not.toBeDisabled();
  });

  it("fetches the necessary data on load", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );
    expect(store.getActions().some((action) => action.type === "fabric/fetch"));
    expect(store.getActions().some((action) => action.type === "subnet/fetch"));
    expect(store.getActions().some((action) => action.type === "vlan/fetch"));
  });

  it("displays a spinner when data is loading", async () => {
    state.fabric.loaded = false;
    state.subnet.loaded = false;
    state.vlan.loaded = false;
    renderWithBrowserRouter(
      <EditBondForm
        close={jest.fn()}
        nic={nic}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("can dispatch an action to update a bond", async () => {
    const bond = machineInterfaceFactory({
      id: 3,
      name: "bond1",
      type: NetworkInterfaceTypes.BOND,
      vlan_id: 1,
      params: {
        bond_xmit_hash_policy: BondXmitHashPolicy.LAYER2,
        bond_lacp_rate: BondLacpRate.FAST,
      },
    });
    state.general.bondOptions.loaded = true;
    state.general.bondOptions.data = bondOptionsFactory({
      lacp_rates: [
        [BondLacpRate.FAST, BondLacpRate.FAST],
        [BondLacpRate.SLOW, BondLacpRate.SLOW],
      ],
      modes: [
        [BondMode.BALANCE_RR, BondMode.BALANCE_RR],
        [BondMode.ACTIVE_BACKUP, BondMode.ACTIVE_BACKUP],
        [BondMode.BALANCE_XOR, BondMode.BALANCE_XOR],
        [BondMode.BROADCAST, BondMode.BROADCAST],
        [BondMode.LINK_AGGREGATION, BondMode.LINK_AGGREGATION],
        [BondMode.BALANCE_TLB, BondMode.BALANCE_TLB],
        [BondMode.BALANCE_ALB, BondMode.BALANCE_ALB],
      ],
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          bond,
          machineInterfaceFactory({
            id: 9,
            type: NetworkInterfaceTypes.PHYSICAL,
            vlan_id: 1,
          }),
          machineInterfaceFactory({
            id: 10,
            type: NetworkInterfaceTypes.PHYSICAL,
            vlan_id: 1,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const link = { id: 1, subnet_id: 1, mode: NetworkLinkMode.AUTO };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditBondForm
        close={jest.fn()}
        link={link}
        nic={bond}
        selected={[{ nicId: 9 }, { nicId: 10 }]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Subnet" }),
      screen.getByRole("option", { name: /test-subnet-1/ })
    );
    expect(
      screen.getByRole("button", { name: "Save interface" })
    ).toBeEnabled();

    await userEvent.click(
      screen.getByRole("button", { name: "Save interface" })
    );

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateInterface")
    ).toStrictEqual({
      type: "machine/updateInterface",
      meta: {
        model: "machine",
        method: "update_interface",
      },
      payload: {
        params: {
          bond_downdelay: 0,
          bond_lacp_rate: "fast",
          bond_mode: BondMode.ACTIVE_BACKUP,
          bond_miimon: 0,
          bond_updelay: 0,
          bond_xmit_hash_policy: BondXmitHashPolicy.LAYER2,
          fabric: 1,
          interface_id: bond.id,
          link_id: 1,
          mac_address: "00:00:00:00:00:26",
          mode: NetworkLinkMode.LINK_UP,
          name: "bond1",
          parents: [9, 10],
          subnet: "1",
          system_id: "abc123",
          tags: [],
          vlan: 1,
        },
      },
    });
  });
});
