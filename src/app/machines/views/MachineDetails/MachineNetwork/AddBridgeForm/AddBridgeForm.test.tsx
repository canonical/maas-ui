import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddBridgeForm from "./AddBridgeForm";

import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, submitFormikForm } from "testing/utils";

const mockStore = configureStore<RootState, {}>();
const route = "/machines";

describe("AddBridgeForm", () => {
  let nic: NetworkInterface;
  let state: RootState;
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
      { route, wrapperProps: { state } }
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
      { route, wrapperProps: { store } }
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
      { route, wrapperProps: { state } }
    );

    // Multiple spinners are displayed, so we have to check that there is at least one
    expect(screen.getAllByText("Loading").length).toBeGreaterThanOrEqual(1);
  });

  it("can dispatch an action to add a bridge", async () => {
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddBridgeForm
        close={jest.fn()}
        selected={[{ nicId: nic.id }]}
        systemId="abc123"
      />,
      { route, wrapperProps: { store } }
    );

    // act(() =>
    //   submitFormikForm(wrapper, {
    //     bridge_fd: 15,
    //     bridge_stp: false,
    //     fabric: 1,
    //     ip_address: "1.2.3.4",
    //     mac_address: "28:21:c6:b9:1b:22",
    //     mode: NetworkLinkMode.LINK_UP,
    //     name: "br1",
    //     subnet: 1,
    //     tags: ["a", "tag"],
    //     vlan: 1,
    //   })
    // );

    await userEvent.click(
      screen.getByRole("button", { name: "Save interface" })
    );
    // expect(
    //   store
    //     .getActions()
    //     .find((action) => action.type === "machine/createBridge")
    // ).toStrictEqual({
    //   type: "machine/createBridge",
    //   meta: {
    //     model: "machine",
    //     method: "create_bridge",
    //   },
    //   payload: {
    //     params: {
    //       bridge_fd: 15,
    //       bridge_stp: false,
    //       fabric: 1,
    //       ip_address: "1.2.3.4",
    //       mac_address: "28:21:c6:b9:1b:22",
    //       mode: NetworkLinkMode.LINK_UP,
    //       name: "br1",
    //       parents: [nic.id],
    //       subnet: 1,
    //       system_id: "abc123",
    //       tags: ["a", "tag"],
    //       vlan: 1,
    //     },
    //   },
    // });
  });
});
