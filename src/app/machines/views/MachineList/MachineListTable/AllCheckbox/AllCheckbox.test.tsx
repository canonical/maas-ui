import configureStore from "redux-mock-store";

import AllCheckbox, { Label } from "./AllCheckbox";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  machineStateList as machineStateListFactory,
  machineState as machineStateFactory,
} from "testing/factories";
import { userEvent, screen, renderWithMockStore } from "testing/utils";

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
  state.machine.selected = null;
  renderWithMockStore(<AllCheckbox callId={callId} />, { state });
  expect(
    screen.getByRole("checkbox", { name: Label.AllMachines })
  ).not.toBeChecked();
});

it("is checked if there is a selected filter", () => {
  state.machine.selected = {
    filter: {
      owner: "admin",
    },
  };
  renderWithMockStore(<AllCheckbox callId={callId} />, { state });
  expect(
    screen.getByRole("checkbox", { name: Label.AllMachines })
  ).toBeChecked();
});

it("is partially checked if a group is selected", () => {
  state.machine.selected = {
    groups: ["admin1"],
  };
  renderWithMockStore(<AllCheckbox callId={callId} />, { state });
  expect(
    screen.getByRole("checkbox", { name: Label.AllMachines })
  ).toBePartiallyChecked();
});

it("is partially checked if a machine is selected", () => {
  state.machine.selected = {
    items: ["abc123"],
  };
  renderWithMockStore(<AllCheckbox callId={callId} />, { state });
  expect(
    screen.getByRole("checkbox", { name: Label.AllMachines })
  ).toBePartiallyChecked();
});

it("can dispatch an action to select all", async () => {
  const filter = {
    owner: ["admin1"],
  };
  const store = mockStore(state);
  renderWithMockStore(<AllCheckbox callId={callId} filter={filter} />, {
    store,
  });
  await userEvent.click(
    screen.getByRole("checkbox", { name: Label.AllMachines })
  );
  const expected = machineActions.setSelected({
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
  state.machine.selected = {
    filter,
  };
  const store = mockStore(state);
  renderWithMockStore(<AllCheckbox callId={callId} filter={filter} />, {
    store,
  });
  await userEvent.click(
    screen.getByRole("checkbox", { name: Label.AllMachines })
  );
  const expected = machineActions.setSelected(null);
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});
