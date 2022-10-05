import reduxToolkit from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Labels as SourceMachineDetailsLabel } from "./SourceMachineDetails/SourceMachineDetails";
import SourceMachineSelect, { Label } from "./SourceMachineSelect";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
  machineState as machineStateFactory,
  machineStateList,
  machineStateListGroup,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("SourceMachineSelect", () => {
  let machines: Machine[];
  let state: RootState;

  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
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
        lists: {
          "123456": machineStateList({
            groups: [
              machineStateListGroup({
                items: machines.map(({ system_id }) => system_id),
              }),
            ],
            loaded: true,
          }),
        },
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows a spinner while data is loading", () => {
    renderWithMockStore(
      <SourceMachineSelect loadingData onMachineClick={jest.fn()} />,
      { state }
    );
    expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
  });

  it("shows an error if no machines are available to select", () => {
    state.machine.lists["123456"] = machineStateList({
      loaded: true,
      loading: false,
      count: 0,
    });
    renderWithMockStore(<SourceMachineSelect onMachineClick={jest.fn()} />, {
      state,
    });
    expect(screen.getByText(Label.NoSourceMachines)).toBeInTheDocument();
  });

  it("does not show an error if machines are available to select", () => {
    renderWithMockStore(<SourceMachineSelect onMachineClick={jest.fn()} />, {
      state,
    });
    expect(
      screen.queryByRole("heading", { name: Label.NoSourceMachines })
    ).not.toBeInTheDocument();
  });

  it("shows the machine's details when selected", () => {
    const selectedMachine = machineDetailsFactory();

    renderWithMockStore(
      <SourceMachineSelect
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
        onMachineClick={onMachineClick}
        selectedMachine={selectedMachine}
      />,
      { state }
    );

    await userEvent.type(
      screen.getByRole("combobox", { name: /Search/i }),
      " "
    );
    expect(onMachineClick).toHaveBeenCalledWith(null);
  });
});
