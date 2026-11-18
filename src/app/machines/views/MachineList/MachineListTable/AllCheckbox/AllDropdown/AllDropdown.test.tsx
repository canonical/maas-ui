import AllDropdown, { AllDropdownLabel } from "./AllDropdown";

import { machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import { FetchNodeStatus } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithProviders } from "@/testing/utils";

let state: RootState;
const callId = "123456";

beforeEach(() => {
  state = factory.rootState({
    machine: factory.machineState({
      lists: {
        [callId]: factory.machineStateList(),
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

  const { store } = renderWithProviders(
    <AllDropdown callId={callId} filter={filter} />,
    {
      state,
    }
  );
  await userEvent.click(
    screen.getByRole("button", {
      name: AllDropdownLabel.AllMachinesOptions,
    })
  );
  await userEvent.click(
    screen.getByRole("menuitem", {
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
    factory.machineStateListGroup({
      count: 1,
      items: ["abc123"],
      name: "Deployed",
      value: FetchNodeStatus.DEPLOYED,
    }),
    factory.machineStateListGroup({
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

  const { store } = renderWithProviders(
    <AllDropdown callId={callId} filter={null} />,
    { state }
  );
  await userEvent.click(
    screen.getByRole("button", {
      name: AllDropdownLabel.AllMachinesOptions,
    })
  );
  await userEvent.click(
    screen.getByRole("menuitem", {
      name: AllDropdownLabel.SelectAllMachinesOnThisPage,
    })
  );
  const expected = machineActions.setSelected(expectedSelectedMachines);
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});

it("does not duplicate machines or groups that are already selected when selecting the current page", async () => {
  state.machine.lists[callId].groups = [
    factory.machineStateListGroup({
      count: 2,
      items: ["abc123", "def456"],
      name: "Deployed",
      value: FetchNodeStatus.DEPLOYED,
    }),
    factory.machineStateListGroup({
      count: 2,
      collapsed: true,
      name: "Failed testing",
      value: FetchNodeStatus.FAILED_TESTING,
    }),
  ];
  // The current page is already selected, along with a machine from another page.
  state.machine.selected = {
    groups: ["failed_testing"],
    items: ["abc123", "def456", "ghi789"],
  };

  const { store } = renderWithProviders(
    <AllDropdown callId={callId} filter={null} />,
    { state }
  );
  await userEvent.click(
    screen.getByRole("button", {
      name: AllDropdownLabel.AllMachinesOptions,
    })
  );
  await userEvent.click(
    screen.getByRole("menuitem", {
      name: AllDropdownLabel.SelectAllMachinesOnThisPage,
    })
  );
  const expected = machineActions.setSelected({
    groups: ["failed_testing"],
    items: ["abc123", "def456", "ghi789"],
  });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});
