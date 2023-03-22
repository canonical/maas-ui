import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineListControls from "./MachineListControls";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("MachineListControls", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory();
    initialState.machine = machineStateFactory({
      loaded: true,
      loading: false,
      filtersLoaded: true,
      filtersLoading: false,
      items: [
        machineFactory({
          fqdn: "abc123",
          system_id: "abc123",
        }),
      ],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("changes the filter when the filter accordion changes", () => {
    const store = mockStore(initialState);
    const setFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <MachineListControls
            filter=""
            grouping={null}
            hiddenColumns={[]}
            setFilter={setFilter}
            setGrouping={jest.fn()}
            setHiddenColumns={jest.fn()}
            setHiddenGroups={jest.fn()}
            setSidePanelContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find(MachinesFilterAccordion).props().setSearchText("status:new");
    });
    expect(setFilter).toHaveBeenCalledWith("status:new");
  });

  it("shows search bar, filter accordion, and grouping select when no machines are selected", () => {
    renderWithBrowserRouter(
      <MachineListControls
        filter=""
        grouping={null}
        hiddenColumns={[]}
        setFilter={jest.fn()}
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/machines", state: initialState }
    );

    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Group by" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Actions" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Power cycle" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Troubleshoot" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Categorise" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Lock" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" })
    ).not.toBeInTheDocument();
  });

  it("hides search bar, filter accordion, and grouping select when machines are selected", () => {
    initialState.machine.selectedMachines = { items: ["abc123"] };
    renderWithBrowserRouter(
      <MachineListControls
        filter=""
        grouping={null}
        hiddenColumns={[]}
        setFilter={jest.fn()}
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/machines", state: initialState }
    );

    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Power cycle" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Troubleshoot" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Categorise" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lock" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Filters" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("searchbox", { name: "Search" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: "Group by" })
    ).not.toBeInTheDocument();
  });

  it("dispatches an action to clear selected machines when the 'Clear seleciton' button is clicked", async () => {
    initialState.machine.selectedMachines = { items: ["abc123"] };
    const store = mockStore(initialState);
    renderWithBrowserRouter(
      <MachineListControls
        filter=""
        grouping={null}
        hiddenColumns={[]}
        setFilter={jest.fn()}
        setGrouping={jest.fn()}
        setHiddenColumns={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/machines", store }
    );

    const clearSelection = screen.getByRole("button", {
      name: "Clear selection",
    });

    await userEvent.click(clearSelection);

    const actions = store.getActions();
    expect(actions).toEqual(
      expect.arrayContaining([machineActions.setSelectedMachines(null)])
    );
  });
});
