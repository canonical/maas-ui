import { screen, within } from "@testing-library/react";
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
import { renderWithMockStore } from "testing/utils";

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
        loaded: true,
      }),
      tag: tagStateFactory({
        items: [
          tagFactory({ id: 12, name: "tagA" }),
          tagFactory({ id: 13, name: "tagB" }),
        ],
      }),
    });
  });

  it("shows a spinner while data is loading", () => {
    state.machine.loaded = false;
    renderWithMockStore(
      <MachineSelectTable
        machines={machines}
        onMachineClick={jest.fn()}
        searchText=""
        setSearchText={jest.fn()}
      />,
      { state }
    );
    expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
  });

  it("highlights the substring that matches the search text", async () => {
    renderWithMockStore(
      <MachineSelectTable
        machines={[machines[0]]}
        onMachineClick={jest.fn()}
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
});
