import VMsActionBar from "./VMsActionBar";

import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  within,
  renderWithProviders,
} from "@/testing/utils";

describe("VMsActionBar", () => {
  it("executes onAddVMClick on add VM button click", async () => {
    const onAddVMClick = vi.fn();
    const state = factory.rootState();

    renderWithProviders(
      <VMsActionBar
        currentPage={1}
        machinesLoading={false}
        onAddVMClick={onAddVMClick}
        searchFilter=""
        setCurrentPage={vi.fn()}
        setSearchFilter={vi.fn()}
        vmCount={2}
      />,
      { state }
    );

    await userEvent.click(screen.getByTestId("add-vm"));

    expect(onAddVMClick).toHaveBeenCalled();
  });

  it("disables VM actions if none are selected", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        selected: null,
      }),
    });

    renderWithProviders(
      <VMsActionBar
        currentPage={1}
        machinesLoading={false}
        onAddVMClick={vi.fn()}
        searchFilter=""
        setCurrentPage={vi.fn()}
        setSearchFilter={vi.fn()}
        vmCount={2}
      />,
      { state }
    );

    expect(
      within(screen.getByTestId("take-action-dropdown")).getByRole("button")
    ).toBeAriaDisabled();
    expect(screen.getByTestId("delete-vm")).toBeAriaDisabled();
  });

  it("enables VM actions if at least one is selected", () => {
    const vms = [factory.machine({ system_id: "abc123" })];
    const state = factory.rootState({
      machine: factory.machineState({
        items: vms,
        selected: { items: ["abc123"] },
      }),
    });

    renderWithProviders(
      <VMsActionBar
        currentPage={1}
        machinesLoading={false}
        onAddVMClick={vi.fn()}
        searchFilter=""
        setCurrentPage={vi.fn()}
        setSearchFilter={vi.fn()}
        vmCount={2}
      />,
      { state }
    );

    expect(
      within(screen.getByTestId("take-action-dropdown")).getByRole("button")
    ).not.toBeAriaDisabled();
    expect(screen.getByTestId("delete-vm")).not.toBeAriaDisabled();
  });
});
