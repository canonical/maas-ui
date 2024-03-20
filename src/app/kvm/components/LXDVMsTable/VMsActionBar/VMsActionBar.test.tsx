import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMsActionBar from "./VMsActionBar";

import * as factory from "@/testing/factories";
import { userEvent, render, screen, within } from "@/testing/utils";

const mockStore = configureStore();

describe("VMsActionBar", () => {
  it("executes onAddVMClick on add VM button click", async () => {
    const onAddVMClick = vi.fn();
    const state = factory.rootState();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          machinesLoading={false}
          onAddVMClick={onAddVMClick}
          searchFilter=""
          setCurrentPage={vi.fn()}
          setSearchFilter={vi.fn()}
          setSidePanelContent={vi.fn()}
          vmCount={2}
        />
      </Provider>
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
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          machinesLoading={false}
          onAddVMClick={vi.fn()}
          searchFilter=""
          setCurrentPage={vi.fn()}
          setSearchFilter={vi.fn()}
          setSidePanelContent={vi.fn()}
          vmCount={2}
        />
      </Provider>
    );

    expect(
      within(screen.getByTestId("take-action-dropdown")).getByRole("button")
    ).toBeDisabled();
    expect(screen.getByTestId("delete-vm")).toBeDisabled();
  });

  it("enables VM actions if at least one is selected", () => {
    const vms = [factory.machine({ system_id: "abc123" })];
    const state = factory.rootState({
      machine: factory.machineState({
        items: vms,
        selected: { items: ["abc123"] },
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          machinesLoading={false}
          onAddVMClick={vi.fn()}
          searchFilter=""
          setCurrentPage={vi.fn()}
          setSearchFilter={vi.fn()}
          setSidePanelContent={vi.fn()}
          vmCount={2}
        />
      </Provider>
    );

    expect(
      within(screen.getByTestId("take-action-dropdown")).getByRole("button")
    ).not.toBeDisabled();
    expect(screen.getByTestId("delete-vm")).not.toBeDisabled();
  });
});
