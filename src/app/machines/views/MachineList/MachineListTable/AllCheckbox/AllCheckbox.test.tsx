import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import AllCheckbox from "./AllCheckbox";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  machineStateList as machineStateListFactory,
  machineState as machineStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

let state: RootState;
const callId = "123456";

beforeEach(() => {
  state = rootStateFactory({
    machine: machineStateFactory({
      lists: {
        [callId]: machineStateListFactory(),
      },
    }),
  });
});

it("is unchecked if there are no filters, groups or items selected", () => {
  state.machine.selectedMachines = null;
  renderWithMockStore(<AllCheckbox callId={callId} />, { state });
  expect(screen.getByRole("checkbox")).not.toBeChecked();
});

it("is checked if there is a selected filter", () => {
  state.machine.selectedMachines = {
    filter: {
      owner: "admin",
    },
  };
  renderWithMockStore(<AllCheckbox callId={callId} />, { state });
  expect(screen.getByRole("checkbox")).toBeChecked();
});

it("is partially checked if a group is selected", () => {
  state.machine.selectedMachines = {
    groups: ["admin1"],
  };
  renderWithMockStore(<AllCheckbox callId={callId} />, { state });
  expect(screen.getByRole("checkbox")).toBePartiallyChecked();
});

it("is partially checked if a machine is selected", () => {
  state.machine.selectedMachines = {
    items: ["abc123"],
  };
  renderWithMockStore(<AllCheckbox callId={callId} />, { state });
  expect(screen.getByRole("checkbox")).toBePartiallyChecked();
});

it("can dispatch an action to select all", async () => {
  const filter = {
    owner: ["admin1"],
  };
  const store = mockStore(state);
  renderWithMockStore(<AllCheckbox callId={callId} filter={filter} />, {
    store,
  });
  await userEvent.click(screen.getByRole("checkbox"));
  const expected = machineActions.setSelectedMachines({
    filter,
  });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});

it("can dispatch an action to unselect all", async () => {
  const filter = {
    owner: ["admin1"],
  };
  state.machine.selectedMachines = {
    filter,
  };
  const store = mockStore(state);
  renderWithMockStore(<AllCheckbox callId={callId} filter={filter} />, {
    store,
  });
  await userEvent.click(screen.getByRole("checkbox"));
  const expected = machineActions.setSelectedMachines(null);
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});
