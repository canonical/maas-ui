import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import AddInterface from "./AddInterface";

import type { RootState } from "app/store/root/types";
import { NetworkLinkMode } from "app/store/types/enum";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();
const route = "/machines";

describe("AddInterface", () => {
  let state: RootState;
  const fabric = fabricFactory();
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabric, fabricFactory()],
        loaded: true,
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
        items: [subnetFactory(), subnetFactory()],
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

  it("fetches the necessary data on load", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddInterface close={jest.fn()} systemId="abc123" />,
      { route, wrapperProps: { store } }
    );
    const expectedActions = ["fabric/fetch", "vlan/fetch"];
    expectedActions.forEach((expectedAction) => {
      expect(
        store.getActions().some((action) => action.type === expectedAction)
      );
    });
  });

  it("displays a spinner when data is loading", async () => {
    state.vlan.loaded = false;
    state.fabric.loaded = false;
    renderWithBrowserRouter(
      <AddInterface close={jest.fn()} systemId="abc123" />,
      { route, wrapperProps: { state } }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("correctly dispatches actions to add a physical interface", async () => {
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddInterface close={jest.fn()} systemId="abc123" />,
      { route, wrapperProps: { store } }
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "MAC address" }),
      "28:21:c6:b9:1b:22"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Fabric" }),
      "1"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Subnet" }),
      ""
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save interface" })
    );

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createPhysical")
    ).toStrictEqual({
      type: "machine/createPhysical",
      meta: {
        model: "machine",
        method: "create_physical",
      },
      payload: {
        params: {
          fabric: "1",
          mac_address: "28:21:c6:b9:1b:22",
          mode: NetworkLinkMode.LINK_UP,
          name: "eth0",
          system_id: "abc123",
          tags: [],
          vlan: "28",
        },
      },
    });
  });
});
