import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Label as SourceMachineDetailsLabel } from "./SourceMachineDetails/SourceMachineDetails";
import SourceMachineSelect, { Label } from "./SourceMachineSelect";

import { Label as MachineSelectTableLabel } from "app/base/components/MachineSelectTable/MachineSelectTable";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("SourceMachineSelect", () => {
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
      tag: tagStateFactory({
        items: [
          tagFactory({ id: 12, name: "tagA" }),
          tagFactory({ id: 13, name: "tagB" }),
        ],
      }),
    });
  });

  it("shows a spinner while data is loading", () => {
    renderWithMockStore(
      <SourceMachineSelect
        loadingData
        machines={machines}
        onMachineClick={jest.fn()}
      />,
      { state }
    );
    expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
  });

  it("shows an error if no machines are available to select", () => {
    renderWithMockStore(
      <SourceMachineSelect machines={[]} onMachineClick={jest.fn()} />,
      { state }
    );
    expect(
      screen.getByRole("heading", { name: Label.NoSourceMachines })
    ).toBeInTheDocument();
  });

  it("does not shows an error if machines are available to select", () => {
    renderWithMockStore(
      <SourceMachineSelect
        machines={[machineFactory()]}
        onMachineClick={jest.fn()}
      />,
      { state }
    );
    expect(
      screen.queryByRole("heading", { name: Label.NoSourceMachines })
    ).not.toBeInTheDocument();
  });

  it("can filter machines by hostname, system_id and/or tags", async () => {
    renderWithMockStore(
      <SourceMachineSelect machines={machines} onMachineClick={jest.fn()} />,
      { state }
    );
    const searchbox = screen.getByRole("searchbox");
    // Filter by "first" which matches the hostname of the first machine
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, "first");
    let hostnameCols = screen.getAllByRole("gridcell", {
      name: MachineSelectTableLabel.Hostname,
    });
    expect(hostnameCols).toHaveLength(1);
    expect(within(hostnameCols[0]).getByText("first")).toBeInTheDocument();
    // Filter by "def" which matches the system_id of the second machine
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, "def");
    hostnameCols = screen.getAllByRole("gridcell", {
      name: MachineSelectTableLabel.Hostname,
    });
    expect(hostnameCols).toHaveLength(1);
    expect(within(hostnameCols[0]).getByText("def")).toBeInTheDocument();

    // Filter by "tag" which matches the tags of the first and second machine
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, "tag");
    const ownerCols = screen.getAllByRole("gridcell", {
      name: MachineSelectTableLabel.Owner,
    });
    expect(ownerCols).toHaveLength(2);
    expect(within(ownerCols[0]).getByText("tag")).toBeInTheDocument();
    expect(within(ownerCols[1]).getByText("tag")).toBeInTheDocument();
  });

  it("shows the machine's details when selected", () => {
    const selectedMachine = machineDetailsFactory();

    renderWithMockStore(
      <SourceMachineSelect
        machines={machines}
        onMachineClick={jest.fn()}
        selectedMachine={selectedMachine}
      />,
      { state }
    );

    expect(
      screen.getByLabelText(SourceMachineDetailsLabel.Title)
    ).toBeInTheDocument();
  });

  it("clears the selected machine on search input change", async () => {
    const selectedMachine = machineDetailsFactory();
    const onMachineClick = jest.fn();

    renderWithMockStore(
      <SourceMachineSelect
        machines={machines}
        onMachineClick={onMachineClick}
        selectedMachine={selectedMachine}
      />,
      { state }
    );

    await userEvent.type(screen.getByRole("searchbox"), " ");
    expect(onMachineClick).toHaveBeenCalledWith(null);
  });
});
