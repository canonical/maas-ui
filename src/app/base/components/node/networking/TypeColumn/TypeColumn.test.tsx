import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TypeColumn from "./TypeColumn";

import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("TypeColumn", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  it("displays an icon when bond is over multiple numa nodes", () => {
    const interfaces = [machineInterfaceFactory({ numa_node: 1 })];
    const nic = machineInterfaceFactory({
      numa_node: 2,
      parents: [interfaces[0].id],
    });
    interfaces.push(nic);
    state.machine.items = [
      machineDetailsFactory({
        interfaces,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TypeColumn nic={nic} node={state.machine.items[0]} />,
      { store, route: "/machines" }
    );
    expect(screen.getByTestId("double-row").exists()).toBe(true);
    expect(screen.getByRole("Icon")).toBeTruthy();
  });

  it("does not display an icon for single numa nodes", () => {
    const nic = machineInterfaceFactory({
      numa_node: 2,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TypeColumn nic={nic} node={state.machine.items[0]} />,
      { store, route: "/machines" }
    );
    expect(screen.getByTestId("double-row").exists()).toBe(true);
    expect(screen.queryByRole("Icon")).toBeNull();
  });

  it("displays the full type for parent interfaces", () => {
    const interfaces = [
      machineInterfaceFactory({ type: NetworkInterfaceTypes.BOND }),
    ];
    const nic = machineInterfaceFactory({
      children: [interfaces[0].id],
    });
    interfaces.push(nic);
    state.machine.items = [
      machineDetailsFactory({
        interfaces,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TypeColumn nic={nic} node={state.machine.items[0]} />,
      { store, route: "/machines" }
    );
    expect(screen.getByTestId("double-row").props().primary).toBe(
      "Bonded physical"
    );
  });
});
