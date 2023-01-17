import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import AddBridgeForm from "./AddBridgeForm";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
} from "testing/factories";
import { screen, within, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();
const route = urls.machines.index;

describe("AddBridgeForm", () => {
  let nic: NetworkInterface;
  let state: RootState;
  const fabric = fabricFactory();
  beforeEach(() => {
    nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state = rootStateFactory({
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
      fabric: fabricStateFactory({
        items: [fabric, fabricFactory()],
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [
          vlanFactory({
            fabric: fabric.id,
            vid: 2,
            name: "vlan-name",
            external_dhcp: null,
            dhcp_on: true,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a table", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const selected = [{ nicId: nic.id }];
    renderWithBrowserRouter(
      <AddBridgeForm close={jest.fn()} selected={selected} systemId="abc123" />,
      { route, state }
    );
    const table = screen.getByRole("grid");
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect(within(table).getByText("eth2")).toBeInTheDocument();
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddBridgeForm
        close={jest.fn()}
        selected={[{ nicId: nic.id }]}
        systemId="abc123"
      />,
      { route, store }
    );
    expect(store.getActions().some((action) => action.type === "vlan/fetch"));
  });

  it("displays a spinner when data is loading", () => {
    state.vlan.loaded = false;
    state.machine.loaded = false;
    renderWithBrowserRouter(
      <AddBridgeForm
        close={jest.fn()}
        selected={[{ nicId: nic.id }]}
        systemId="abc123"
      />,
      { route, state }
    );

    // Multiple spinners are displayed, so we have to check that there is at least one
    expect(screen.getAllByText("Loading").length).toBeGreaterThanOrEqual(1);
  });

  it("can dispatch an action to add a bridge", async () => {
    state.machine.selectedMachines = { items: ["abc123", "def456"] };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddBridgeForm
        close={jest.fn()}
        selected={[{ nicId: nic.id }]}
        systemId="abc123"
      />,
      { route, store }
    );

    const macAddressField = screen.getByRole("textbox", {
      name: "MAC address",
    });

    await userEvent.clear(macAddressField);
    await userEvent.type(macAddressField, "28:21:c6:b9:1b:22");

    await userEvent.click(
      screen.getByRole("button", { name: "Save interface" })
    );

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createBridge")
    ).toStrictEqual({
      type: "machine/createBridge",
      meta: {
        model: "machine",
        method: "create_bridge",
      },
      payload: {
        params: {
          bridge_stp: false,
          fabric: "1",
          bridge_type: "standard",
          mac_address: "28:21:c6:b9:1b:22",
          name: "br0",
          parents: [nic.id],
          system_id: "abc123",
          tags: [],
          vlan: "39",
        },
      },
    });
  });
});
