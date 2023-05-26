import InterfaceFormTable from "./InterfaceFormTable";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore, screen } from "testing/utils";

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
    renderWithMockStore(
      <InterfaceFormTable interfaces={[]} systemId="abc123" />,
      { state }
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
    renderWithMockStore(
      <InterfaceFormTable interfaces={[{ nicId: nic.id }]} systemId="abc123" />,
      { state }
    );

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("displays a PXE column by default", () => {
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    renderWithMockStore(
      <InterfaceFormTable interfaces={[{ nicId: nic.id }]} systemId="abc123" />,
      { state }
    );

    expect(
      screen.getByRole("columnheader", { name: "PXE" })
    ).toBeInTheDocument();
  });

  it("can show checkboxes to update the selection", () => {
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    renderWithMockStore(
      <InterfaceFormTable
        interfaces={[{ nicId: nic.id }]}
        selectedEditable
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("mutes a row if its not selected", () => {
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    renderWithMockStore(
      <InterfaceFormTable
        interfaces={[{ nicId: nic.id }]}
        selected={[]}
        selectedEditable
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    expect(screen.getAllByRole("row")[1]).toHaveClass("p-table__row--muted");
  });
});
