import configureStore from "redux-mock-store";

import MachineListSelectedCount from "./MachineListSelectedCount";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  screen,
  renderWithMockStore,
  getTestState,
  userEvent,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("MachineListSelectedCount", () => {
  let state: RootState;
  beforeEach(() => {
    state = getTestState();
  });

  it("displays the number of selected machines", () => {
    renderWithMockStore(
      <MachineListSelectedCount
        filter={""}
        machineCount={20}
        selectedCount={10}
      />,
      { state }
    );

    expect(screen.getByText(/10 machines selected/i)).toBeInTheDocument();
  });

  it("displays a button to select all machines", () => {
    renderWithMockStore(
      <MachineListSelectedCount
        filter={""}
        machineCount={20}
        selectedCount={10}
      />,
      { state }
    );

    expect(screen.getByRole("button")).toHaveTextContent(
      "Select all 20 machines"
    );
  });

  it("displays a button to select all filtered machines", () => {
    renderWithMockStore(
      <MachineListSelectedCount
        filter={"filter"}
        machineCount={20}
        selectedCount={10}
      />,
      { state }
    );

    expect(screen.getByRole("button")).toHaveTextContent(
      "Select all 20 filtered machines"
    );
  });

  it("displays a button to clear selection if all machines are selected", () => {
    renderWithMockStore(
      <MachineListSelectedCount
        filter={""}
        machineCount={20}
        selectedCount={20}
      />,
      { state }
    );

    expect(screen.getByText(/Selected all 20 machines/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Clear selection");
  });

  it("dispatches an action to select all machines", async () => {
    const store = mockStore(state);
    renderWithMockStore(
      <MachineListSelectedCount
        filter={""}
        machineCount={20}
        selectedCount={10}
      />,
      { store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Select all 20 machines" })
    );

    const expectedAction = machineActions.setSelectedMachines({ filter: {} });

    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("dispatches an action to select all filtered machines", async () => {
    const store = mockStore(state);
    renderWithMockStore(
      <MachineListSelectedCount
        filter={"this-is-a-filter"}
        machineCount={20}
        selectedCount={10}
      />,
      { store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Select all 20 filtered machines" })
    );

    const expectedAction = machineActions.setSelectedMachines({
      filter: { free_text: ["this-is-a-filter"] },
    });

    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("dispatches an action to clear the selection", async () => {
    const store = mockStore(state);
    renderWithMockStore(
      <MachineListSelectedCount
        filter={""}
        machineCount={20}
        selectedCount={20}
      />,
      { store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Clear selection" })
    );

    const expectedAction = machineActions.setSelectedMachines(null);

    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
