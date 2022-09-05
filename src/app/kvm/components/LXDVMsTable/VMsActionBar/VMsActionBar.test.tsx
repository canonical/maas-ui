import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMsActionBar from "./VMsActionBar";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMsActionBar", () => {
  it("executes onAddVMClick on add VM button click", async () => {
    const onAddVMClick = jest.fn();
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          machinesLoading={false}
          onAddVMClick={onAddVMClick}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setHeaderContent={jest.fn()}
          setSearchFilter={jest.fn()}
          vmCount={2}
        />
      </Provider>
    );

    await userEvent.click(screen.getByTestId("add-vm"));

    expect(onAddVMClick).toHaveBeenCalled();
  });

  it("disables VM actions if none are selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        selected: [],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          machinesLoading={false}
          onAddVMClick={jest.fn()}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setHeaderContent={jest.fn()}
          setSearchFilter={jest.fn()}
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
    const vms = [machineFactory({ system_id: "abc123" })];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
        selected: ["abc123"],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          machinesLoading={false}
          onAddVMClick={jest.fn()}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setHeaderContent={jest.fn()}
          setSearchFilter={jest.fn()}
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
