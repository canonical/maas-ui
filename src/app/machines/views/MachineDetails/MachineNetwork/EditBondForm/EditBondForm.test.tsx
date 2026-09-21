import configureStore from "redux-mock-store";

import EditBondForm from "./EditBondForm";

import {
  BondLacpRate,
  BondMode,
  BondXmitHashPolicy,
} from "@/app/store/general/types";
import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "@/app/store/types/enum";
import type { NetworkInterface } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  waitFor,
  within,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("EditBondForm", () => {
  let state: RootState;
  let nic: NetworkInterface;

  beforeEach(() => {
    nic = factory.machineInterface({
      type: NetworkInterfaceTypes.BOND,
      vlan_id: 1,
    });
    state = factory.rootState({
      fabric: factory.fabricState({
        loaded: true,
        items: [factory.fabric({ name: "test-fabric", id: 1 })],
      }),
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
      subnet: factory.subnetState({
        items: [factory.subnet({ id: 1, name: "test-subnet-1", vlan: 1 })],
        loaded: true,
      }),
      vlan: factory.vlanState({
        items: [
          factory.vlan({
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
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      factory.machineDetails({
        system_id: "abc123",
        interfaces,
      }),
    ];
    nic.parents = [interfaces[0].id, interfaces[1].id];
    renderWithBrowserRouter(
      <EditBondForm
        close={vi.fn()}
        nic={nic}
        selected={[]}
        setSelected={vi.fn()}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("displays the selected interfaces when not editing members", () => {
    const interfaces = [
      factory.machineInterface({
        name: "eth0",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        name: "eth1",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      factory.machineDetails({
        system_id: "abc123",
        interfaces,
      }),
    ];
    nic.parents = [interfaces[0].id, interfaces[1].id];
    renderWithBrowserRouter(
      <EditBondForm
        close={vi.fn()}
        nic={nic}
        selected={[]}
        setSelected={vi.fn()}
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
      factory.machineInterface({
        name: "valid0",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        name: "valid1",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      // VLANs are not valid.
      factory.machineInterface({
        name: "notvalid0",
        type: NetworkInterfaceTypes.VLAN,
        vlan_id: 1,
      }),
      // Bridges are not valid.
      factory.machineInterface({
        name: "notvalid1",
        type: NetworkInterfaceTypes.BRIDGE,
        vlan_id: 1,
      }),
      // Bonds are not valid.
      factory.machineInterface({
        name: "notvalid2",
        type: NetworkInterfaceTypes.BOND,
        vlan_id: 1,
      }),
      // Physical interfaces in other VLANs are not valid.
      factory.machineInterface({
        name: "notvalid3",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 2,
      }),
      // Physical interfaces in the same VLAN are valid.
      factory.machineInterface({
        name: "valid2",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      factory.machineDetails({
        system_id: "abc123",
        interfaces,
      }),
    ];
    nic.parents = [interfaces[0].id, interfaces[1].id];
    renderWithBrowserRouter(
      <EditBondForm
        close={vi.fn()}
        nic={nic}
        selected={[]}
        setSelected={vi.fn()}
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

  it("disables the submit button if fewer than two members are selected", async () => {
    const interfaces = [
      factory.machineInterface({
        name: "eth0",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        name: "eth1",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        name: "eth2",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      factory.machineDetails({
        system_id: "abc123",
        interfaces,
      }),
    ];
    nic.parents = [interfaces[0].id, interfaces[1].id];
    const setSelected = vi.fn();
    renderWithBrowserRouter(
      <EditBondForm
        close={vi.fn()}
        nic={nic}
        selected={[]}
        setSelected={setSelected}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    const saveButton = screen.getByRole("button", { name: "Save interface" });
    await userEvent.click(
      screen.getByRole("button", { name: "Edit bond members" })
    );
    expect(screen.getByRole("checkbox", { name: "eth0" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "eth1" })).toBeChecked();
    await userEvent.click(screen.getByRole("checkbox", { name: "eth2" }));
    await waitFor(() => {
      expect(saveButton).not.toBeAriaDisabled();
    });

    await userEvent.click(screen.getByRole("checkbox", { name: "eth0" }));
    await waitFor(() => {
      expect(saveButton).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("checkbox", { name: "eth1" }));
    await waitFor(() => {
      expect(saveButton).toBeAriaDisabled();
    });
    expect(setSelected).toHaveBeenLastCalledWith([
      expect.objectContaining({ nicId: interfaces[2].id }),
    ]);
  });

  it("enables the submit button if only the members have changed", async () => {
    const interfaces = [
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        name: "eth2",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      factory.machineDetails({
        system_id: "abc123",
        interfaces,
      }),
    ];
    nic.parents = [interfaces[0].id, interfaces[1].id];
    const setSelected = vi.fn();
    renderWithBrowserRouter(
      <EditBondForm
        close={vi.fn()}
        nic={nic}
        selected={[]}
        setSelected={setSelected}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    const saveButton = screen.getByRole("button", { name: "Save interface" });
    expect(saveButton).toBeAriaDisabled();
    await userEvent.click(
      screen.getByRole("button", { name: "Edit bond members" })
    );
    // Change local membership while the incoming selection remains empty.
    await userEvent.click(screen.getByRole("checkbox", { name: "eth2" }));
    await waitFor(() => {
      expect(saveButton).not.toBeAriaDisabled();
    });
    expect(setSelected).toHaveBeenLastCalledWith([
      { nicId: interfaces[0].id },
      { nicId: interfaces[1].id },
      expect.objectContaining({ nicId: interfaces[2].id }),
    ]);
    // Restoring the original members makes the form unchanged again.
    await userEvent.click(screen.getByRole("checkbox", { name: "eth2" }));
    await waitFor(() => {
      expect(saveButton).toBeAriaDisabled();
    });
  });

  it("fetches the necessary data on load", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditBondForm
        close={vi.fn()}
        nic={nic}
        selected={[]}
        setSelected={vi.fn()}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );
    expect(
      store.getActions().some((action) => action.type === "fabric/fetch")
    ).toBe(true);
    expect(
      store.getActions().some((action) => action.type === "subnet/fetch")
    ).toBe(true);
    expect(
      store.getActions().some((action) => action.type === "vlan/fetch")
    ).toBe(true);
  });

  it("displays a spinner when data is loading", async () => {
    state.fabric.loaded = false;
    state.subnet.loaded = false;
    state.vlan.loaded = false;
    renderWithBrowserRouter(
      <EditBondForm
        close={vi.fn()}
        nic={nic}
        selected={[]}
        setSelected={vi.fn()}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("can dispatch an action to update a bond", async () => {
    const bond = factory.machineInterface({
      id: 3,
      name: "bond1",
      mac_address: "00:00:00:00:00:26",
      parents: [9, 10],
      type: NetworkInterfaceTypes.BOND,
      vlan_id: 1,
      params: {
        bond_xmit_hash_policy: BondXmitHashPolicy.LAYER2,
        bond_lacp_rate: BondLacpRate.FAST,
      },
    });
    state.general.bondOptions.loaded = true;
    state.general.bondOptions.data = factory.bondOptions({
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
      factory.machineDetails({
        interfaces: [
          bond,
          factory.machineInterface({
            id: 9,
            type: NetworkInterfaceTypes.PHYSICAL,
            vlan_id: 1,
          }),
          factory.machineInterface({
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
        close={vi.fn()}
        link={link}
        nic={bond}
        selected={[]}
        setSelected={vi.fn()}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Subnet" }),
      screen.getByRole("option", { name: /test-subnet-1/ })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Save interface" })
      ).not.toBeAriaDisabled();
    });
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
