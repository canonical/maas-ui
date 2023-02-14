import { ContextualMenu } from "@canonical/react-components";
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
import { screen, waitFor, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

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
              searchFilter=""
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
              searchFilter=""
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
        searchFilter=""
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
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { state }
    );
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("disables the add hardware menu when machines are selected", () => {
    state.machine.selectedMachines = { items: ["abc123"] };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListHeader
              searchFilter=""
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find('[data-testid="add-hardware-dropdown"]')
        .find(ContextualMenu)
        .props().toggleDisabled
    ).toBe(true);
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
        searchFilter=""
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
        searchFilter=""
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
              searchFilter=""
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

  it("displays a new label for the tag action", () => {
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selectedMachines = { items: ["abc123"] };
    // A machine needs the tag action for it to appear in the menu.
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.TAG] }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListHeader
              searchFilter=""
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Open the take action menu.
    wrapper
      .find(
        '[data-testid="take-action-dropdown"] button.p-contextual-menu__toggle'
      )
      .simulate("click");
    expect(
      wrapper
        .find("button[data-testid='action-link-tag']")
        .text()
        .includes("(NEW)")
    ).toBe(true);
  });

  it("hides the tag action's new label after it has been clicked", () => {
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
    const Header = () => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListHeader
              searchFilter=""
              setSearchFilter={jest.fn()}
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let wrapper = mount(<Header />);
    // Open the take action menu.
    wrapper
      .find(
        '[data-testid="take-action-dropdown"] button.p-contextual-menu__toggle'
      )
      .simulate("click");
    const tagAction = wrapper.find("button[data-testid='action-link-tag']");
    // The new label should appear before being clicked.
    expect(tagAction.text().includes("(NEW)")).toBe(true);
    tagAction.simulate("click");
    // Render the header again
    wrapper = mount(<Header />);
    // Open the take action menu.
    wrapper
      .find(
        '[data-testid="take-action-dropdown"] button.p-contextual-menu__toggle'
      )
      .simulate("click");
    // The new label should now be hidden.
    expect(
      wrapper
        .find("button[data-testid='action-link-tag']")
        .text()
        .includes("(NEW)")
    ).toBe(false);
  });
});
