import configureStore from "redux-mock-store";

import MachinesFilterAccordion, { Label } from "./MachinesFilterAccordion";

import { actions as machineActions } from "app/store/machine";
import { FilterGroupKey } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  machineFilterGroup as machineFilterGroupFactory,
} from "testing/factories";
import { userEvent, screen, renderWithMockStore, waitFor } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("MachinesFilterAccordion", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        filters: [machineFilterGroupFactory()],
        filtersLoaded: true,
      }),
    });
  });

  it("filter is disabled when filter have not loaded", async () => {
    state.machine.filtersLoaded = false;
    renderWithMockStore(
      <MachinesFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { state }
    );
    expect(screen.getByRole("button", { name: Label.Toggle })).toBeDisabled();
  });

  it("does not fetch filters if filters have been loaded", async () => {
    state.machine.filtersLoaded = true;
    const store = mockStore(state);
    renderWithMockStore(
      <MachinesFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { store }
    );
    expect(store.getActions()).toEqual(
      expect.not.arrayContaining([machineActions.filterGroups()])
    );
  });

  it("fetches filters if filters have not been loaded", async () => {
    state.machine.filtersLoaded = false;
    const store = mockStore(state);
    renderWithMockStore(
      <MachinesFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { store }
    );
    await waitFor(() =>
      expect(store.getActions()).toEqual([machineActions.filterGroups()])
    );
  });

  it("can display options", async () => {
    state.machine.filters = [
      machineFilterGroupFactory({
        key: FilterGroupKey.Status,
        loaded: true,
        options: [{ key: "status1", label: "Status 1" }],
      }),
    ];
    renderWithMockStore(
      <MachinesFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { state }
    );
    // Open the menu:
    await userEvent.click(screen.getByRole("button", { name: Label.Toggle }));
    // Toggle open a filter group.
    await userEvent.click(screen.getByRole("tab", { name: Label.Status }));
    expect(
      screen.getByRole("checkbox", { name: "Status 1" })
    ).toBeInTheDocument();
  });
});
