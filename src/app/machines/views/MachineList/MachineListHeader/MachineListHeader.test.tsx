import * as reduxToolkit from "@reduxjs/toolkit";

import MachineListHeader from "./MachineListHeader";

import urls from "@/app/base/urls";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { screen, renderWithProviders, userEvent } from "@/testing/utils";

vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});
const callId = "mocked-nanoid";

describe("MachineListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    vi.spyOn(query, "generateCallId").mockReturnValue(callId);
    const machines = [
      factory.machine({ system_id: "abc123" }),
      factory.machine({ system_id: "def456" }),
    ];
    state = factory.rootState({
      machine: factory.machineState({
        counts: factory.machineStateCounts({
          [callId]: factory.machineStateCount({
            count: 10,
            loaded: true,
            loading: false,
          }),
        }),
        items: machines,
        statuses: {
          abc123: factory.machineStatus({}),
          def456: factory.machineStatus({}),
        },
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("displays a machine count if machines have loaded", () => {
    state.machine.counts[callId] = factory.machineStateCount({
      count: 2,
      loaded: true,
    });
    renderWithProviders(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={vi.fn()}
        setHiddenColumns={vi.fn()}
        setHiddenGroups={vi.fn()}
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state, initialEntries: [urls.machines.index] }
    );
    expect(screen.getByTestId("main-toolbar-heading")).toHaveTextContent(
      "2 machines in 0 pools"
    );
  });

  it("hides the add hardware menu when machines are selected", () => {
    state.machine.selected = { items: ["abc123"] };
    renderWithProviders(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={vi.fn()}
        setHiddenColumns={vi.fn()}
        setHiddenGroups={vi.fn()}
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state, initialEntries: [urls.machines.index] }
    );
    expect(
      screen.queryByRole("button", { name: "Add hardware" })
    ).not.toBeInTheDocument();
    state.machine.selected.items = [];
    renderWithProviders(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={vi.fn()}
        setHiddenColumns={vi.fn()}
        setHiddenGroups={vi.fn()}
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state, initialEntries: [urls.machines.index] }
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
      factory.machine({ system_id: "abc123", actions: [NodeActions.TAG] }),
    ];
    renderWithProviders(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={vi.fn()}
        setHiddenColumns={vi.fn()}
        setHiddenGroups={vi.fn()}
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state, initialEntries: [urls.machines.index] }
    );
    // Open the take action menu.
    await userEvent.click(screen.getByRole("button", { name: "Categorise" }));

    const tagAction = screen.getByTestId("action-link-tag");

    // The new label should appear before being clicked.
    expect(tagAction).toHaveTextContent(/NEW/);
  });

  it("hides the tag action's new label after it has been clicked", async () => {
    vi.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selected = { items: ["abc123"] };
    // A machine needs the tag action for it to appear in the menu.
    const machine = factory.machine({
      system_id: "abc123",
      actions: [NodeActions.TAG],
    });
    state.machine.items = [machine];
    state.machine.lists = {
      "mocked-nanoid": factory.machineStateList({
        loaded: true,
        groups: [
          factory.machineStateListGroup({
            items: [machine.system_id],
          }),
        ],
      }),
    };
    const { rerender } = renderWithProviders(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={vi.fn()}
        setHiddenColumns={vi.fn()}
        setHiddenGroups={vi.fn()}
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { state, initialEntries: [urls.machines.index] }
    );
    // Open the take action menu.
    await userEvent.click(screen.getByRole("button", { name: "Categorise" }));

    let tagAction = screen.getByTestId("action-link-tag");

    // The new label should appear before being clicked.
    expect(tagAction).toHaveTextContent(/NEW/);

    await userEvent.click(tagAction);

    // Render the header again
    rerender();
    // Open the take action menu.
    await userEvent.click(screen.getByRole("button", { name: "Categorise" }));
    // The new label should now be hidden.
    tagAction = screen.getByTestId("action-link-tag");
    expect(tagAction).not.toHaveTextContent(/NEW/);
  });
});
