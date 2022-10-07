import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import EditAliasOrVlanForm from "./EditAliasOrVlanForm";

import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
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
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("EditAliasOrVlanForm", () => {
  let nic: NetworkInterface;
  let state: RootState;

  beforeEach(() => {
    nic = machineInterfaceFactory({
      id: 1,
    });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabricFactory({ id: 69 }), fabricFactory({ id: 420 })],
        loaded: true,
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
        items: [subnetFactory(), subnetFactory()],
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [vlanFactory({ fabric: 69, id: 1 })],
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={jest.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", wrapperProps: { store } }
    );
    const expectedActions = ["fabric/fetch", "subnet/fetch", "vlan/fetch"];
    expectedActions.forEach((expectedAction) => {
      expect(
        store.getActions().some((action) => action.type === expectedAction)
      );
    });
  });

  it("displays a spinner when data is loading", () => {
    state.fabric.loaded = false;
    state.subnet.loaded = false;
    state.vlan.loaded = false;
    state.machine.items = [];
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={jest.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", wrapperProps: { state } }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a tag field for a VLAN", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={jest.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", wrapperProps: { store } }
    );
    expect(screen.getByRole("textbox", { name: "Tags" })).toBeInTheDocument();
  });

  it("dispatches an action to update an alias", async () => {
    const link = networkLinkFactory({});
    nic.links = [networkLinkFactory(), link];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={jest.fn()}
        interfaceType={NetworkInterfaceTypes.ALIAS}
        link={link}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", wrapperProps: { store } }
    );

    await userEvent.click(screen.getByRole("button", { name: "Save Alias" }));
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
          fabric: "69",
          interface_id: nic.id,
          link_id: link.id,
          mode: NetworkLinkMode.AUTO,
          system_id: "abc123",
          vlan: "1",
        },
      },
    });
  });

  it("dispatches an action to update a VLAN", async () => {
    const link = networkLinkFactory({ id: 101 });
    nic.links = [networkLinkFactory(), link];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={jest.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        link={link}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", wrapperProps: { store } }
    );

    await userEvent.click(screen.getByRole("button", { name: "Save Alias" }));

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
          fabric: "69",
          interface_id: nic.id,
          link_id: link.id,
          mode: NetworkLinkMode.AUTO,
          system_id: "abc123",
          tags: [],
          vlan: "1",
        },
      },
    });
  });
});
