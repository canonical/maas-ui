import configureStore from "redux-mock-store";

import AllDropdown, { AllDropdownLabel } from "./AllDropdown";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { FetchNodeStatus } from "app/store/types/node";
import {
  rootState as rootStateFactory,
  machineStateList as machineStateListFactory,
  machineState as machineStateFactory,
  machineStateListGroup as machineStateListGroupFactory,
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

it("can dispatch an action to select all machines using a dropdown", async () => {
  const filter = {
    owner: ["admin1"],
  };
  state.machine.selected = {
    filter,
  };
  const store = mockStore(state);
  renderWithMockStore(<AllDropdown callId={callId} filter={filter} />, {
    store,
  });
  await userEvent.click(
    screen.getByRole("button", {
      name: AllDropdownLabel.AllMachinesOptions,
    })
  );
  await userEvent.click(
    screen.getByRole("button", {
      name: AllDropdownLabel.SelectAllMachines,
    })
  );
  const expected = machineActions.setSelected({ filter });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});

it("can dispatch an action to select all machines on current page using a dropdown", async () => {
  state.machine.lists[callId].groups = [
    machineStateListGroupFactory({
      count: 1,
      items: ["abc123"],
      name: "Deployed",
      value: FetchNodeStatus.DEPLOYED,
    }),
    machineStateListGroupFactory({
      count: 2,
      collapsed: true,
      name: "Failed testing",
      value: FetchNodeStatus.FAILED_TESTING,
    }),
  ];
  const expectedSelectedMachines = {
    groups: ["failed_testing"],
    items: ["abc123"],
  };
  const store = mockStore(state);
  renderWithMockStore(<AllDropdown callId={callId} filter={null} />, {
    store,
  });
  await userEvent.click(
    screen.getByRole("button", {
      name: AllDropdownLabel.AllMachinesOptions,
    })
  );
  await userEvent.click(
    screen.getByRole("button", {
      name: AllDropdownLabel.SelectAllMachinesOnThisPage,
    })
  );
  const expected = machineActions.setSelected(expectedSelectedMachines);
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});
