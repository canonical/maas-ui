import userEvent from "@testing-library/user-event";

import MachinesFilterAccordion, { Label } from "./MachinesFilterAccordion";

import { FilterGroupKey } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  machineFilterGroup as machineFilterGroupFactory,
} from "testing/factories";
import { screen, renderWithMockStore } from "testing/utils";

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
