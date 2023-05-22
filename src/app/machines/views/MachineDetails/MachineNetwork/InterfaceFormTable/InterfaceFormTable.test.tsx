import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import InterfaceFormTable from "./InterfaceFormTable";

import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("InterfaceFormTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
        loaded: true,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <InterfaceFormTable interfaces={[]} systemId="abc123" />,
      { store }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays a table when loaded", () => {
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <InterfaceFormTable interfaces={[{ nicId: nic.id }]} systemId="abc123" />,
      { store }
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("displays a PXE column by default", () => {
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <InterfaceFormTable interfaces={[{ nicId: nic.id }]} systemId="abc123" />,
      { store }
    );

    expect(screen.getByText(/PXE/i)).toBeInTheDocument();
  });

  it("can show checkboxes to update the selection", () => {
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <InterfaceFormTable
        interfaces={[{ nicId: nic.id }]}
        selectedEditable
        systemId="abc123"
      />,
      { store }
    );

    expect(screen.getByLabelText(/select row/i)).toBeInTheDocument();
  });

  it("mutes a row if its not selected", () => {
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <InterfaceFormTable
        interfaces={[{ nicId: nic.id }]}
        selected={[]}
        selectedEditable
        systemId="abc123"
      />,
      { store }
    );

    expect(
      screen.getByRole("row", { name: `${nic.name} muted row` })
    ).toHaveClass("p-table__row--muted");
  });
});
