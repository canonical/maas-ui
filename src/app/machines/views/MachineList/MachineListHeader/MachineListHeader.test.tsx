import reduxToolkit from "@reduxjs/toolkit";

import MachineListHeader from "./MachineListHeader";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import { callId, enableCallIdMocks } from "testing/callId-mock";
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

enableCallIdMocks();

describe("MachineListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];
    state = rootStateFactory({
      machine: machineStateFactory({
        counts: machineStateCountsFactory({
          [callId]: machineStateCountFactory({
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
    state.machine.counts[callId] = machineStateCountFactory({
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
    expect(screen.getByTestId("main-toolbar-heading")).toHaveTextContent(
      "2 machines in 1 pool"
    );
  });

  it("hides the add hardware menu when machines are selected", () => {
    state.machine.selected = { items: ["abc123"] };
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
      screen.queryByRole("button", { name: "Add hardware" })
    ).not.toBeInTheDocument();
    state.machine.selected.items = [];
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
      screen.getByRole("button", { name: "Add hardware" })
    ).toBeInTheDocument();
  });

  it("displays a new label for the tag action", async () => {
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selected = { items: ["abc123"] };
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
    state.machine.selected = { items: ["abc123"] };
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
