import reduxToolkit from "@reduxjs/toolkit";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineListHeader from "./MachineListHeader";

import urls from "app/base/urls";
import { MachineHeaderViews } from "app/machines/constants";
import { FetchGroupKey } from "app/store/machine/types";
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
import {
  screen,
  waitFor,
  renderWithBrowserRouter,
  userEvent,
} from "testing/utils";

const mockStore = configureStore<RootState>();

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

  it("displays a loader if machines have not loaded", () => {
    state.machine.selectedMachines = {
      groups: ["admin"],
      grouping: FetchGroupKey.Owner,
    };
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      loading: true,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListHeader
              grouping={null}
              searchFilter=""
              setGrouping={jest.fn()}
              setHiddenColumns={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a machine count if machines have loaded", () => {
    state.machine.counts["mocked-nanoid-1"] = machineStateCountFactory({
      count: 2,
      loaded: true,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListHeader
              grouping={null}
              searchFilter=""
              setGrouping={jest.fn()}
              setHiddenColumns={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-title"]').text()).toBe(
      "2 machines in 1 pool"
    );
  });

  it("displays a spinner if the selected group count is loading", () => {
    state.machine.selectedMachines = {
      groups: ["admin"],
      grouping: FetchGroupKey.Owner,
    };
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      loading: true,
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
        sidePanelContent={null}
      />,
      { state }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("does not display a spinner if only machines are selected and the count is loading", () => {
    state.machine.selectedMachines = { items: ["abc123"] };
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      count: 10,
      loaded: true,
    });
    state.machine.counts["mocked-nanoid-3"] = machineStateCountFactory({
      loading: true,
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
        sidePanelContent={null}
      />,
      { state }
    );
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
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
        sidePanelContent={null}
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
        sidePanelContent={null}
      />,
      { state, route: urls.machines.index }
    );
    expect(screen.getByTestId("add-hardware-dropdown")).toBeInTheDocument();
  });

  it("closes action form when all machines are deselected", async () => {
    state.machine.selectedMachines = { items: ["abc123"] };
    const allMachinesCount = 10;
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      count: allMachinesCount,
      loaded: true,
    });
    const setSidePanelContent = jest.fn();
    renderWithBrowserRouter(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSearchFilter={jest.fn()}
        setSidePanelContent={setSidePanelContent}
        sidePanelContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
      />,
      { state, route: urls.machines.index }
    );
    expect(setSidePanelContent).not.toHaveBeenCalled();
    expect(screen.getByText("Deploy")).toBeInTheDocument();
    state.machine.selectedMachines.items = [];
    renderWithBrowserRouter(
      <MachineListHeader
        grouping={null}
        searchFilter=""
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSearchFilter={jest.fn()}
        setSidePanelContent={setSidePanelContent}
        sidePanelContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
      />
    );
    await waitFor(() => expect(setSidePanelContent).toHaveBeenCalledWith(null));
  });

  it("displays the action title if an action is selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListHeader
              grouping={null}
              searchFilter=""
              setGrouping={jest.fn()}
              setHiddenColumns={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-title"]').text()).toBe(
      "0 machines in 1 pool"
    );
    expect(
      wrapper.find('[data-testid="section-header-content"] h3').text()
    ).toBe("Deploy");
  });

  it("displays a new label for the tag action", async () => {
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selectedMachines = { items: ["abc123"] };
    // A machine needs the tag action for it to appear in the menu.
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.TAG] }),
    ];
    const store = mockStore(state);
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
      { route: "/machines", store }
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
    const store = mockStore(state);
    const { rerender } = renderWithBrowserRouter(
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
      { route: "/machines", store }
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
        sidePanelContent={null}
      />
    );
    // Open the take action menu.
    await userEvent.click(screen.getByRole("button", { name: "Categorise" }));
    // The new label should now be hidden.
    tagAction = screen.getByTestId("action-link-tag");
    expect(tagAction).not.toHaveTextContent(/NEW/);
  });
});
