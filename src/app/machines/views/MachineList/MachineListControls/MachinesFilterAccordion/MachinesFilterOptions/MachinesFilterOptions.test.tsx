import configureStore from "redux-mock-store";

import MachinesFilterOptions, { Label } from "./MachinesFilterOptions";

import { actions as machineActions } from "app/store/machine";
import type { FilterGroup } from "app/store/machine/types";
import { FilterGroupKey } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  machineFilterGroup as machineFilterGroupFactory,
} from "testing/factories";
import { userEvent, screen, waitFor, renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("MachinesFilterOptions", () => {
  let state: RootState;
  let filterGroup: FilterGroup;

  beforeEach(() => {
    filterGroup = machineFilterGroupFactory({
      key: FilterGroupKey.Status,
      options: [{ key: "status1", label: "Status 1" }],
      loaded: true,
    });
    state = rootStateFactory({
      machine: machineStateFactory({
        filters: [filterGroup],
        filtersLoaded: true,
      }),
    });
  });

  it("fetches options if they haven't been loaded", async () => {
    filterGroup.loaded = false;
    filterGroup.loading = false;
    const store = mockStore(state);
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        setSearchText={jest.fn()}
      />,
      { store }
    );
    const expected = machineActions.filterOptions(FilterGroupKey.Status);
    await waitFor(() => {
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });
  });

  it("does not fetch options if they're loading", async () => {
    filterGroup.loaded = false;
    filterGroup.loading = true;
    const store = mockStore(state);
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        setSearchText={jest.fn()}
      />,
      { store }
    );
    const expected = machineActions.filterOptions(FilterGroupKey.Status);
    await waitFor(() => {
      expect(
        store.getActions().filter((action) => action.type === expected.type)
      ).toHaveLength(0);
    });
  });

  it("does not fetch options if they have already loaded", async () => {
    filterGroup.loaded = true;
    filterGroup.loading = false;
    const store = mockStore(state);
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        setSearchText={jest.fn()}
      />,
      { store }
    );
    const expected = machineActions.filterOptions(FilterGroupKey.Status);
    await waitFor(() => {
      expect(
        store.getActions().filter((action) => action.type === expected.type)
      ).toHaveLength(0);
    });
  });

  it("displays a spinner while loading options", async () => {
    filterGroup.loaded = false;
    filterGroup.loading = true;
    const store = mockStore(state);
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        setSearchText={jest.fn()}
      />,
      { store }
    );
    expect(screen.getByText(Label.Loading)).toBeInTheDocument();
  });

  it("displays a message if there are no options", async () => {
    filterGroup.options = [];
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        setSearchText={jest.fn()}
      />,
      { state }
    );
    expect(screen.getByText(Label.None)).toBeInTheDocument();
  });

  it("displays options", async () => {
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        setSearchText={jest.fn()}
      />,
      { state }
    );
    expect(
      screen.getByRole("checkbox", { name: "Status 1" })
    ).toBeInTheDocument();
  });

  it("displays active options", async () => {
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        searchText="status:(=status1)"
        setSearchText={jest.fn()}
      />,
      { state }
    );
    expect(screen.getByRole("checkbox", { name: "Status 1" })).toBeChecked();
  });

  it("can set a filter", async () => {
    const setSearchText = jest.fn();
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        setSearchText={setSearchText}
      />,
      { state }
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Status 1" }));
    expect(setSearchText).toHaveBeenCalledWith("status:(=status1)");
  });

  it("can set a boolean filter", async () => {
    filterGroup.options = [{ key: true, label: "Yes" }];
    const setSearchText = jest.fn();
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        setSearchText={setSearchText}
      />,
      { state }
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Yes" }));
    expect(setSearchText).toHaveBeenCalledWith("status:(=true)");
  });

  it("can remove a filter", async () => {
    const setSearchText = jest.fn();
    renderWithMockStore(
      <MachinesFilterOptions
        group={FilterGroupKey.Status}
        searchText="status:(=status1)"
        setSearchText={setSearchText}
      />,
      { state }
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Status 1" }));
    expect(setSearchText).toHaveBeenCalledWith("");
  });
});
