import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import AddBondForm from "./AddBondForm";

import urls from "app/base/urls";
import { BondMode } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { screen, within, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();
const route = urls.machines.index;

describe("AddBondForm", () => {
  let state: RootState;
  const fabric = fabricFactory();
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
        items: [fabric],
      }),
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
      subnet: subnetStateFactory({
        loaded: true,
        items: [subnetFactory()],
      }),
      vlan: vlanStateFactory({
        items: [
          vlanFactory({
            fabric: fabric.id,
            id: 1,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a table", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
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
    renderWithBrowserRouter(
      <AddBondForm
        close={jest.fn()}
        selected={[{ nicId: 9 }, { nicId: 10 }]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route, state }
    );
    expect(
      screen.getByRole("heading", { name: "Create bond" })
    ).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("displays the selected interfaces when not editing members", async () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
        name: "test-interface-1",
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
        name: "test-interface-2",
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
      <AddBondForm
        close={jest.fn()}
        selected={selected}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route, state }
    );
    const table = screen.getByRole("grid");
    expect(within(table).getByText("test-interface-1")).toBeInTheDocument();
    expect(within(table).getByText("test-interface-2")).toBeInTheDocument();
  });

  it("displays all valid interfaces when editing members", async () => {
    const interfaces = [
      machineInterfaceFactory({
        name: "test-interface-1",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        name: "test-interface-2",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      // VLANs are not valid.
      machineInterfaceFactory({
        name: "test-interface-3",
        type: NetworkInterfaceTypes.VLAN,
        vlan_id: 1,
      }),
      // Bridges are not valid.
      machineInterfaceFactory({
        name: "test-interface-4",
        type: NetworkInterfaceTypes.BRIDGE,
        vlan_id: 1,
      }),
      // Bonds are not valid.
      machineInterfaceFactory({
        name: "test-interface-5",
        type: NetworkInterfaceTypes.BOND,
        vlan_id: 1,
      }),
      // Physical interfaces in other VLANs are not valid.
      machineInterfaceFactory({
        name: "test-interface-6",
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 2,
      }),
      // Physical interfaces in the same VLAN are valid.
      machineInterfaceFactory({
        name: "test-interface-7",
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
      <AddBondForm
        close={jest.fn()}
        selected={selected}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route, state }
    );
    let table = screen.getByRole("grid");
    // Check that selected interfaces are shown
    expect(within(table).getByText("test-interface-1")).toBeInTheDocument();
    expect(within(table).getByText("test-interface-2")).toBeInTheDocument();

    // Check that unselected interfaces are not shown
    expect(
      within(table).queryByText("test-interface-3")
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByText("test-interface-4")
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByText("test-interface-5")
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByText("test-interface-6")
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByText("test-interface-7")
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("edit-members"));
    table = screen.getByRole("grid");

    // Check that only valid interfaces are shown
    expect(within(table).getByText("test-interface-1")).toBeInTheDocument();
    expect(within(table).getByText("test-interface-2")).toBeInTheDocument();
    expect(within(table).getByText("test-interface-7")).toBeInTheDocument();

    // Ensure invalid interfaces are not shown
    expect(
      within(table).queryByText("test-interface-3")
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByText("test-interface-4")
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByText("test-interface-5")
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByText("test-interface-6")
    ).not.toBeInTheDocument();
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
      <AddBondForm
        close={jest.fn()}
        selected={[{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      {
        route,
        state,
      }
    );
    await userEvent.click(screen.getByTestId("edit-members"));

    rerender(
      <AddBondForm
        close={jest.fn()}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />
    );
    expect(
      screen.getByRole("button", { name: "Save interface" })
    ).toBeDisabled();
  });

  it("fetches the necessary data on load", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddBondForm
        close={jest.fn()}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route, store }
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
      <AddBondForm
        close={jest.fn()}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route, state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays a spinner if the VLAN hasn't been set", async () => {
    state.fabric.loaded = true;
    state.subnet.loaded = true;
    state.vlan.loaded = true;
    renderWithBrowserRouter(
      <AddBondForm
        close={jest.fn()}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route, state }
    );
    expect(screen.getByTestId("data-loading")).toBeInTheDocument();
  });

  it("can dispatch an action to add a bond", async () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddBondForm
        close={jest.fn()}
        selected={[{ nicId: 9 }, { nicId: 10 }]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { route, store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save interface" })
    );
    expect(
      store.getActions().find((action) => action.type === "machine/createBond")
    ).toStrictEqual({
      type: "machine/createBond",
      meta: {
        model: "machine",
        method: "create_bond",
      },
      payload: {
        params: {
          bond_downdelay: 0,
          bond_mode: BondMode.ACTIVE_BACKUP,
          bond_miimon: 0,
          bond_updelay: 0,
          fabric: 1,
          mac_address: "00:00:00:00:00:15",
          name: "bond0",
          parents: [9, 10],
          system_id: "abc123",
          tags: [],
          vlan: 1,
        },
      },
    });
  });
});
