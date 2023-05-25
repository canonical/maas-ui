import configureStore from "redux-mock-store";

import EditPhysicalForm from "./EditPhysicalForm";

import type { RootState } from "app/store/root/types";
import { NetworkLinkMode } from "app/store/types/enum";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("EditPhysicalForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabricFactory({ id: 1 }), fabricFactory()],
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [
              machineInterfaceFactory({
                id: 1,
                vlan_id: 1,
                links: [networkLinkFactory({ id: 1, subnet_id: 1 })],
              }),
            ],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 1, vlan: 1 }), subnetFactory()],
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [vlanFactory({ id: 1, fabric: 1 }), vlanFactory()],
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditPhysicalForm close={jest.fn()} nicId={1} systemId="abc123" />,
      { route: "/machines", store }
    );
    const expectedActions = ["fabric/fetch", "vlan/fetch"];
    expectedActions.forEach((expectedAction) => {
      expect(
        store.getActions().some((action) => action.type === expectedAction)
      );
    });
  });

  it("displays a spinner when data is loading", () => {
    state.vlan.loaded = false;
    state.fabric.loaded = false;
    renderWithBrowserRouter(
      <EditPhysicalForm close={jest.fn()} nicId={1} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("correctly dispatches actions to edit a physical interface", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditPhysicalForm
        close={jest.fn()}
        linkId={1}
        nicId={1}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );

    await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "eth1");

    await userEvent.clear(screen.getByRole("textbox", { name: "MAC address" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "MAC address" }),
      "28:21:c6:b9:1b:22"
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: "Interface speed (Gbps)" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Interface speed (Gbps)" }),
      "1.5"
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: "Link speed (Gbps)" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Link speed (Gbps)" }),
      "1"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Fabric" }),
      "1"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "VLAN" }),
      "1"
    );
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
          fabric: "1",
          interface_id: 1,
          interface_speed: 1500,
          link_id: 1,
          link_speed: 1000,
          mac_address: "28:21:c6:b9:1b:22",
          mode: NetworkLinkMode.LINK_UP,
          name: "eth1",
          system_id: "abc123",
          tags: [],
          vlan: "1",
        },
      },
    });
  });
});
