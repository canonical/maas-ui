import reduxToolkit from "@reduxjs/toolkit";

import MachineListHeader from "./MachineListHeader";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineStateCount as machineStateCountFactory,
  machineStateCounts as machineStateCountsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter, userEvent } from "testing/utils";

describe("MachineListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    jest
      .spyOn(reduxToolkit, "nanoid")
      .mockReturnValueOnce("mocked-nanoid-1")
      .mockReturnValueOnce("mocked-nanoid-2")
      .mockReturnValueOnce("mocked-nanoid-3");
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];
    state = rootStateFactory({
      machine: machineStateFactory({
        counts: machineStateCountsFactory({
          "mocked-nanoid-1": machineStateCountFactory({
            count: 10,
            loaded: true,
            loading: false,
          }),
        }),
        items: machines,
        statuses: {
          abc123: machineStatusFactory({}),
          def456: machineStatusFactory({}),
        },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [resourcePoolFactory()],
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("displays a machine count if machines have loaded", () => {
    state.machine.counts["mocked-nanoid-1"] = machineStateCountFactory({
      count: 2,
      loaded: true,
    });
    renderWithBrowserRouter(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { state, route: urls.machines.index }
    );
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "2 machines in 1 pool"
    );
  });

  it("hides the add hardware menu when machines are selected", () => {
    state.machine.selectedMachines = { items: ["abc123"] };
    renderWithBrowserRouter(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { state, route: urls.machines.index }
    );
    expect(
      screen.queryByTestId("add-hardware-dropdown")
    ).not.toBeInTheDocument();
    state.machine.selectedMachines.items = [];
    renderWithBrowserRouter(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { state, route: urls.machines.index }
    );
    expect(screen.getByTestId("add-hardware-dropdown")).toBeInTheDocument();
  });

  it("displays a new label for the tag action", async () => {
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selectedMachines = { items: ["abc123"] };
    // A machine needs the tag action for it to appear in the menu.
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.TAG] }),
    ];
    renderWithBrowserRouter(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { state, route: urls.machines.index }
    );
    // Open the take action menu.
    await userEvent.click(screen.getByRole("button", { name: "Categorise" }));

    let tagAction = screen.getByTestId("action-link-tag");

    // The new label should appear before being clicked.
    expect(tagAction).toHaveTextContent(/NEW/);
  });

  it("hides the tag action's new label after it has been clicked", async () => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selectedMachines = { items: ["abc123"] };
    // A machine needs the tag action for it to appear in the menu.
    const machine = machineFactory({
      system_id: "abc123",
      actions: [NodeActions.TAG],
    });
    state.machine.items = [machine];
    state.machine.lists = {
      "mocked-nanoid": machineStateListFactory({
        loaded: true,
        groups: [
          machineStateListGroupFactory({
            items: [machine.system_id],
          }),
        ],
      }),
    };
    const { rerender } = renderWithBrowserRouter(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { state, route: urls.machines.index }
    );
    // Open the take action menu.
    await userEvent.click(screen.getByRole("button", { name: "Categorise" }));

    let tagAction = screen.getByTestId("action-link-tag");

    // The new label should appear before being clicked.
    expect(tagAction).toHaveTextContent(/NEW/);

    await userEvent.click(tagAction);

    // Render the header again
    rerender(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />
    );
    // Open the take action menu.
    await userEvent.click(screen.getByRole("button", { name: "Categorise" }));
    // The new label should now be hidden.
    tagAction = screen.getByTestId("action-link-tag");
    expect(tagAction).not.toHaveTextContent(/NEW/);
  });
});
