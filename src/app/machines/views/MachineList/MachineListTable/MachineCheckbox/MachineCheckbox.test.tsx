import configureStore from "redux-mock-store";

import MachineCheckbox, { getSelectedMachinesRange } from "./MachineCheckbox";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  machineStateList as machineStateListFactory,
  machineState as machineStateFactory,
  machineStateListGroup as machineStateListGroupFactory,
  machine as machineFactory,
} from "testing/factories";
import { userEvent, screen, renderWithMockStore } from "testing/utils";

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
              count: 1,
              items: ["abc123"],
              name: "admin2",
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
    <MachineCheckbox
      callId={callId}
      groupValue="admin2"
      label="spotted-handfish"
      systemId="abc123"
    />,
    { state }
  );
  expect(screen.getByRole("checkbox")).toBeDisabled();
});

it("is checked and disabled if the machine's group is selected", () => {
  state.machine.selectedMachines = {
    groups: ["admin2"],
  };
  renderWithMockStore(
    <MachineCheckbox
      callId={callId}
      groupValue="admin2"
      label="spotted-handfish"
      systemId="abc123"
    />,
    { state }
  );
  expect(screen.getByRole("checkbox")).toBeDisabled();
  expect(screen.getByRole("checkbox")).toBeChecked();
});

it("is checked and disabled if the machine's group is selected and is nullish", () => {
  state.machine.selectedMachines = {
    groups: [""],
  };
  renderWithMockStore(
    <MachineCheckbox
      callId={callId}
      groupValue=""
      label="spotted-handfish"
      systemId="abc123"
    />,
    { state }
  );
  expect(screen.getByRole("checkbox")).toBeDisabled();
  expect(screen.getByRole("checkbox")).toBeChecked();
});

it("is unchecked and enabled if there are no filters or groups selected", () => {
  state.machine.selectedMachines = null;
  renderWithMockStore(
    <MachineCheckbox
      callId={callId}
      groupValue="admin2"
      label="spotted-handfish"
      systemId="abc123"
    />,
    { state }
  );
  expect(screen.getByRole("checkbox")).not.toBeChecked();
  expect(screen.getByRole("checkbox")).not.toBeDisabled();
});

it("is checked if the machine is selected", () => {
  state.machine.selectedMachines = {
    items: ["abc123"],
  };
  renderWithMockStore(
    <MachineCheckbox
      callId={callId}
      groupValue="admin2"
      label="spotted-handfish"
      systemId="abc123"
    />,
    { state }
  );
  expect(screen.getByRole("checkbox")).toBeChecked();
});

it("can dispatch an action to select the machine", async () => {
  const store = mockStore(state);
  renderWithMockStore(
    <MachineCheckbox
      callId={callId}
      groupValue="admin2"
      label="spotted-handfish"
      systemId="abc123"
    />,
    {
      store,
    }
  );
  await userEvent.click(screen.getByRole("checkbox"));
  const expected = machineActions.setSelectedMachines({ items: ["abc123"] });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});

it("can dispatch an action to unselect a machine", async () => {
  state.machine.selectedMachines = {
    groups: ["admin1"],
    items: ["abc123", "def456"],
  };
  const store = mockStore(state);
  renderWithMockStore(
    <MachineCheckbox
      callId={callId}
      groupValue="admin2"
      label="spotted-handfish"
      systemId="abc123"
    />,
    {
      store,
    }
  );
  await userEvent.click(screen.getByRole("checkbox"));
  const expected = machineActions.setSelectedMachines({
    groups: ["admin1"],
    items: ["def456"],
  });
  expect(
    store.getActions().find((action) => action.type === expected.type)
  ).toStrictEqual(expected);
});

describe("getSelectedMachinesRange tests", () => {
  const systemIds = [
    "system_id_1",
    "system_id_2",
    "system_id_3",
    "system_id_4",
  ];
  const machines = systemIds.map((id) => machineFactory({ system_id: id }));

  it("getSelectedMachinesRange selects a range of machines", () => {
    const selectedMachines = { groups: [""], items: [systemIds[0]] };
    const systemId = systemIds.at(-1)!;

    const newSelected = getSelectedMachinesRange({
      systemId,
      machines,
      selected: selectedMachines,
    });

    expect(newSelected.items?.sort()).toStrictEqual(systemIds.sort());
  });

  it("Selects only one machine if there's no previously selected machine", () => {
    const systemId = systemIds[0];
    const selectedMachines = { groups: [""], items: [] };

    const newSelected = getSelectedMachinesRange({
      systemId,
      machines,
      selected: selectedMachines,
    });
    const { items } = newSelected;
    expect(items?.length).toBe(1);
    expect(items![0]).toBe(systemId);
  });
});
