import userEvent from "@testing-library/user-event";

import MachineSelectTable, { Label } from "./MachineSelectTable";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
  machineState as machineStateFactory,
} from "testing/factories";
import { screen, within, renderWithMockStore } from "testing/utils";

describe("MachineSelectTable", () => {
  let machines: Machine[];
  let state: RootState;

  beforeEach(() => {
    machines = [
      machineFactory({
        system_id: "abc123",
        hostname: "first",
        owner: "admin",
        tags: [12],
      }),
      machineFactory({
        system_id: "def456",
        hostname: "second",
        owner: "user",
        tags: [13],
      }),
    ];
    state = rootStateFactory({
      machine: machineStateFactory({
        items: machines,
      }),
      tag: tagStateFactory({
        items: [
          tagFactory({ id: 12, name: "tagA" }),
          tagFactory({ id: 13, name: "tagB" }),
        ],
      }),
    });
  });

  it("shows a loading skeleton while data is loading", () => {
    state.machine.loading = true;
    renderWithMockStore(
      <MachineSelectTable
        machines={machines}
        onMachineClick={jest.fn()}
        pageSize={machines.length}
        searchText=""
        setSearchText={jest.fn()}
      />,
      { state }
    );
    expect(screen.getByRole("grid")).toHaveAttribute("aria-busy", "true");
  });

  it("highlights the substring that matches the search text", async () => {
    renderWithMockStore(
      <MachineSelectTable
        machines={[machines[0]]}
        onMachineClick={jest.fn()}
        pageSize={machines.length}
        searchText="fir"
        setSearchText={jest.fn()}
      />,
      { state }
    );

    let hostnameCol = screen.getByRole("gridcell", {
      name: Label.Hostname,
    });
    // eslint-disable-next-line testing-library/no-node-access
    expect(hostnameCol.querySelector("strong")).toHaveTextContent("fir");
  });

  it("runs onMachineClick function on row click", async () => {
    const onMachineClick = jest.fn();

    renderWithMockStore(
      <MachineSelectTable
        machines={machines}
        onMachineClick={onMachineClick}
        pageSize={machines.length}
        searchText=""
        setSearchText={jest.fn()}
      />,
      { state }
    );

    await userEvent.click(screen.getByRole("row", { name: "first" }));
    expect(onMachineClick).toHaveBeenCalledWith(machines[0]);
  });

  it("displays tag names", () => {
    renderWithMockStore(
      <MachineSelectTable
        machines={machines}
        onMachineClick={jest.fn()}
        pageSize={machines.length}
        searchText=""
        setSearchText={jest.fn()}
      />,
      { state }
    );
    const ownerCols = screen.getAllByRole("gridcell", {
      name: Label.Owner,
    });
    expect(within(ownerCols[0]).getByText("tagA")).toBeInTheDocument();
  });

  it("can select machine by pressing Enter key", async () => {
    const onMachineClick = jest.fn();
    const machine = machines[0];
    renderWithMockStore(
      <MachineSelectTable
        machines={machines}
        onMachineClick={onMachineClick}
        pageSize={machines.length}
        searchText=""
        setSearchText={jest.fn()}
      />,
      { state }
    );
    screen
      .getByRole("row", {
        name: machine.hostname,
      })
      .focus();
    await userEvent.keyboard("{enter}");
    expect(onMachineClick).toHaveBeenCalledWith(machine);
  });

  it("renders with partial search string", async () => {
    const onMachineClick = jest.fn();
    renderWithMockStore(
      <MachineSelectTable
        machines={machines}
        onMachineClick={onMachineClick}
        pageSize={machines.length}
        searchText="id:("
        setSearchText={jest.fn()}
      />,
      { state }
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
