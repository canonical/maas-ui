import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import GroupCheckbox from "./GroupCheckbox";

import { actions as machineActions } from "app/store/machine";
import { FetchGroupKey } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  machineStateList as machineStateListFactory,
  machineState as machineStateFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

let state: RootState;
const callId = "123456";

beforeEach(() => {
  state = rootStateFactory({
    machine: machineStateFactory({
      lists: {
        [callId]: machineStateListFactory({
          groups: [
            machineStateListGroupFactory({
              count: 2,
              name: "admin2",
              value: "admin-2",
            }),
          ],
        }),
      },
    }),
  });
});

it("is disabled if all machines are selected", () => {
  state.machine.selectedMachines = {
    filter: {
      owner: "admin",
    },
  };
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      state,
    }
  );
  expect(screen.getByRole("checkbox")).toBeDisabled();
});

it("is disabled if there are no machines in the group", () => {
  state.machine.lists[callId].groups = [
    machineStateListGroupFactory({
      count: 0,
      name: "admin2",
      value: "admin-2",
    }),
  ];
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      state,
    }
  );
  expect(screen.getByRole("checkbox")).toBeDisabled();
});

it("is not disabled if there are machines in the group", () => {
  state.machine.lists[callId].groups = [
    machineStateListGroupFactory({
      count: 1,
      name: "admin2",
      value: "admin-2",
    }),
  ];
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      state,
    }
  );
  expect(screen.getByRole("checkbox")).not.toBeDisabled();
});

it("is unchecked if there are no filters, groups or items selected", () => {
  state.machine.selectedMachines = null;
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      state,
    }
  );
  expect(screen.getByRole("checkbox")).not.toBeChecked();
});

it("is checked if all machines are selected", () => {
  state.machine.selectedMachines = {
    filter: {
      owner: "admin",
    },
  };
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      state,
    }
  );
  expect(screen.getByRole("checkbox")).toBeChecked();
});

it("is checked if the group is selected", () => {
  state.machine.selectedMachines = {
    groups: ["admin-2"],
  };
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      state,
    }
  );
  expect(screen.getByRole("checkbox")).toBeChecked();
});

it("is partially checked if a machine in the group is selected", () => {
  state.machine.lists[callId].groups = [
    machineStateListGroupFactory({
      count: 2,
      items: ["abc123", "def456"],
      name: "admin2",
      value: "admin-2",
    }),
  ];
  state.machine.selectedMachines = {
    items: ["abc123"],
  };
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      state,
    }
  );
  expect(screen.getByRole("checkbox")).toBePartiallyChecked();
});

it("is not checked if a selected machine is in another group", () => {
  state.machine.lists[callId].groups = [
    machineStateListGroupFactory({
      count: 2,
      items: ["def456"],
      name: "admin1",
    }),
    machineStateListGroupFactory({
      count: 2,
      items: ["abc123"],
      name: "admin2",
      value: "admin-2",
    }),
  ];
  state.machine.selectedMachines = {
    items: ["def456"],
  };
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      state,
    }
  );
  expect(screen.getByRole("checkbox")).not.toBeChecked();
});

it("can dispatch an action to select the group", async () => {
  const store = mockStore(state);
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      store,
    }
  );
  await userEvent.click(screen.getByRole("checkbox"));
  const expected = machineActions.setSelectedMachines({
    grouping: FetchGroupKey.AgentName,
    groups: ["admin-2"],
  });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});

it("removes selected machines that are in the group that was clicked", async () => {
  state.machine.lists[callId].groups = [
    machineStateListGroupFactory({
      count: 2,
      items: ["abc123"],
      name: "admin2",
      value: "admin-2",
    }),
  ];
  state.machine.selectedMachines = {
    items: ["abc123", "def456"],
  };
  const store = mockStore(state);
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      store,
    }
  );
  await userEvent.click(screen.getByRole("checkbox"));
  const expected = machineActions.setSelectedMachines({
    items: ["def456"],
    groups: [],
  });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});

it("does not overwrite selected machines in different groups", async () => {
  state.machine.lists[callId].groups = [
    machineStateListGroupFactory({
      count: 2,
      items: ["def456"],
      name: "admin1",
    }),
    machineStateListGroupFactory({
      count: 2,
      items: ["abc123"],
      name: "admin2",
      value: "admin-2",
    }),
  ];
  state.machine.selectedMachines = {
    items: ["def456"],
  };
  const store = mockStore(state);
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      store,
    }
  );
  await userEvent.click(screen.getByRole("checkbox"));
  const expected = machineActions.setSelectedMachines({
    grouping: FetchGroupKey.AgentName,
    groups: ["admin-2"],
    items: ["def456"],
  });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});

it("can dispatch an action to unselect the group", async () => {
  state.machine.lists[callId].groups = [
    machineStateListGroupFactory({
      count: 2,
      items: ["def456"],
      name: "admin1",
      value: "admin-1",
    }),
    machineStateListGroupFactory({
      count: 2,
      items: ["abc123"],
      name: "admin2",
      value: "admin-2",
    }),
  ];
  state.machine.selectedMachines = {
    groups: ["admin-1", "admin-2"],
    items: ["def456"],
  };
  const store = mockStore(state);
  renderWithMockStore(
    <GroupCheckbox
      callId={callId}
      groupName="admin2"
      grouping={FetchGroupKey.AgentName}
    />,
    {
      store,
    }
  );
  await userEvent.click(screen.getByRole("checkbox"));
  const expected = machineActions.setSelectedMachines({
    groups: ["admin-1"],
    items: ["def456"],
  });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});
