import { ContextualMenu } from "@canonical/react-components";
import reduxToolkit from "@reduxjs/toolkit";
import { screen, waitFor } from "@testing-library/react";
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
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("MachineListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    jest
      .spyOn(reduxToolkit, "nanoid")
      .mockReturnValueOnce("mocked-nanoid-1")
      .mockReturnValueOnce("mocked-nanoid-2")
      .mockReturnValueOnce("mocked-nanoid-3");
    state = rootStateFactory({
      machine: machineStateFactory({
        counts: machineStateCountsFactory({
          "mocked-nanoid-1": machineStateCountFactory({
            count: 10,
            loaded: true,
            loading: false,
          }),
        }),
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory({}),
          def456: machineStatusFactory({}),
        },
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("displays a loader if machines have not loaded", () => {
    state.machine.counts["mocked-nanoid-3"] = machineStateCountFactory({
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
              headerContent={null}
              searchFilter=""
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a machine count if machines have loaded", () => {
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
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
              headerContent={null}
              searchFilter=""
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-subtitle"]').text()).toBe(
      "2 machines available"
    );
  });

  it("displays a spinner if the selected group count is loading", () => {
    state.machine.selectedMachines = {
      groups: ["admin"],
      grouping: FetchGroupKey.Owner,
    };
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      count: 10,
      loaded: true,
    });
    state.machine.counts["mocked-nanoid-3"] = machineStateCountFactory({
      loading: true,
    });
    renderWithBrowserRouter(
      <MachineListHeader
        headerContent={null}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { wrapperProps: { state } }
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
        headerContent={null}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { wrapperProps: { state } }
    );
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("displays a selected count if some machines have been selected", () => {
    state.machine.selectedMachines = { items: ["abc123"] };
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      count: 10,
      loaded: true,
    });
    state.machine.counts["mocked-nanoid-3"] = machineStateCountFactory({
      count: 2,
      loaded: true,
    });
    renderWithBrowserRouter(
      <MachineListHeader
        headerContent={null}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { wrapperProps: { state } }
    );
    expect(screen.getByText("1 of 10 machines selected")).toBeInTheDocument();
  });

  it("displays a selected count if some groups have been selected", () => {
    state.machine.selectedMachines = {
      groups: ["admin"],
      grouping: FetchGroupKey.Owner,
    };
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      count: 10,
      loaded: true,
    });
    state.machine.counts["mocked-nanoid-3"] = machineStateCountFactory({
      count: 2,
      loaded: true,
    });
    renderWithBrowserRouter(
      <MachineListHeader
        headerContent={null}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { wrapperProps: { state } }
    );
    expect(screen.getByText("2 of 10 machines selected")).toBeInTheDocument();
  });

  it("displays a selected count if some machines and groups have been selected", () => {
    state.machine.selectedMachines = {
      items: ["abc123"],
      groups: ["admin"],
      grouping: FetchGroupKey.Owner,
    };
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      count: 10,
      loaded: true,
    });
    state.machine.counts["mocked-nanoid-3"] = machineStateCountFactory({
      count: 2,
      loaded: true,
    });
    renderWithBrowserRouter(
      <MachineListHeader
        headerContent={null}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { wrapperProps: { state } }
    );
    expect(screen.getByText("3 of 10 machines selected")).toBeInTheDocument();
  });

  it("displays a message when all machines have been selected", () => {
    state.machine.selectedMachines = { filter: {} };
    state.machine.counts["mocked-nanoid-2"] = machineStateCountFactory({
      count: 10,
      loaded: true,
    });
    state.machine.counts["mocked-nanoid-3"] = machineStateCountFactory({
      count: 10,
      loaded: true,
    });
    renderWithBrowserRouter(
      <MachineListHeader
        headerContent={null}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { wrapperProps: { state } }
    );
    expect(screen.getByText("All machines selected")).toBeInTheDocument();
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
              headerContent={null}
              searchFilter=""
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
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
    const setHeaderContent = jest.fn();
    const { rerender } = renderWithBrowserRouter(
      <MachineListHeader
        headerContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
        searchFilter=""
        setHeaderContent={setHeaderContent}
        setSearchFilter={jest.fn()}
      />,
      { wrapperProps: { state }, route: urls.machines.index }
    );
    expect(setHeaderContent).not.toHaveBeenCalled();
    expect(screen.getByText("Deploy")).toBeInTheDocument();
    state.machine.selectedMachines.items = [];
    rerender(
      <MachineListHeader
        headerContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
        searchFilter=""
        setHeaderContent={setHeaderContent}
        setSearchFilter={jest.fn()}
      />
    );
    await waitFor(() => expect(setHeaderContent).toHaveBeenCalledWith(null));
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
              headerContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
              searchFilter=""
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-title"]').text()).toBe(
      "Deploy"
    );
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
              headerContent={null}
              searchFilter=""
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
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
    // Set a selected machine so the take action menu becomes enabled.
    state.machine.selectedMachines = { items: ["abc123"] };
    // A machine needs the tag action for it to appear in the menu.
    state.machine.items = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.TAG] }),
    ];
    const store = mockStore(state);
    const Header = () => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListHeader
              headerContent={null}
              searchFilter=""
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
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
