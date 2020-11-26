import machine from "./selectors";

import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("machine selectors", () => {
  it("can get all items", () => {
    const items = [machineFactory(), machineFactory()];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items,
      }),
    });
    expect(machine.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        loading: true,
      }),
    });
    expect(machine.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
      }),
    });
    expect(machine.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        saving: true,
      }),
    });
    expect(machine.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        saved: true,
      }),
    });
    expect(machine.saved(state)).toEqual(true);
  });

  it("can get the active machine's system ID", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: "abc123",
      }),
    });
    expect(machine.activeID(state)).toEqual("abc123");
  });

  it("can get the active machine", () => {
    const activeMachine = machineFactory();
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: activeMachine.system_id,
        items: [activeMachine],
      }),
    });
    expect(machine.active(state)).toEqual(activeMachine);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        errors: "Data is incorrect",
      }),
    });
    expect(machine.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a machine by id", () => {
    const items = [
      machineFactory({ system_id: "808" }),
      machineFactory({ system_id: "909" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items,
      }),
    });
    expect(machine.getById(state, "909")).toStrictEqual(items[1]);
  });

  it("can get the machine statuses", () => {
    const statuses = machineStatusesFactory();
    const state = rootStateFactory({
      machine: machineStateFactory({
        statuses,
      }),
    });
    expect(machine.statuses(state)).toStrictEqual(statuses);
  });

  it("can get the statuses for a machine", () => {
    const machineStatuses = machineStatusFactory();
    const state = rootStateFactory({
      machine: machineStateFactory({
        statuses: machineStatusesFactory({
          abc123: machineStatuses,
        }),
      }),
    });
    expect(machine.getStatuses(state, "abc123")).toStrictEqual(machineStatuses);
  });

  it("can get machines that are processing", () => {
    const statuses = machineStatusesFactory({
      abc123: machineStatusFactory({ testing: true }),
      def456: machineStatusFactory(),
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        statuses,
      }),
    });
    expect(machine.processing(state)).toStrictEqual(["abc123"]);
  });

  it("can get selected machines that are processing", () => {
    const statuses = machineStatusesFactory({
      abc123: machineStatusFactory({ testing: true }),
      def456: machineStatusFactory({ testing: true }),
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        selected: ["abc123"],
        statuses,
      }),
    });
    expect(machine.selectedProcessing(state)).toStrictEqual(["abc123"]);
  });

  it("can get machines that are saving pools", () => {
    const items = [
      machineFactory({ system_id: "808" }),
      machineFactory({ system_id: "909" }),
    ];
    const statuses = machineStatusesFactory({
      "808": machineStatusFactory(),
      "909": machineStatusFactory({ settingPool: true }),
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items,
        statuses,
      }),
    });
    expect(machine.settingPool(state)).toStrictEqual([items[1]]);
  });

  it("can get machines that are both selected and saving pools", () => {
    const items = [
      machineFactory({ system_id: "707" }),
      machineFactory({ system_id: "808" }),
      machineFactory({ system_id: "909" }),
    ];
    const statuses = machineStatusesFactory({
      "707": machineStatusFactory({ settingPool: true }),
      "808": machineStatusFactory(),
      "909": machineStatusFactory({ settingPool: true }),
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items,
        selected: ["909"],
        statuses,
      }),
    });
    expect(machine.settingPoolSelected(state)).toStrictEqual([items[2]]);
  });

  it("can get all event errors", () => {
    const machineEventErrors = [
      machineEventErrorFactory(),
      machineEventErrorFactory(),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: machineEventErrors,
      }),
    });
    expect(machine.eventErrors(state)).toStrictEqual(machineEventErrors);
  });

  it("can get event errors for a machine", () => {
    const machineEventErrors = [
      machineEventErrorFactory({ id: "abc123" }),
      machineEventErrorFactory(),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: machineEventErrors,
      }),
    });
    expect(machine.eventErrorsForIds(state, "abc123")).toStrictEqual([
      machineEventErrors[0],
    ]);
  });

  it("can get event errors for a machine and a provided event", () => {
    const machineEventErrors = [
      machineEventErrorFactory({ id: "abc123", event: NodeActions.TAG }),
      machineEventErrorFactory({ event: NodeActions.TAG }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: machineEventErrors,
      }),
    });
    expect(machine.eventErrorsForIds(state, "abc123")).toStrictEqual([
      machineEventErrors[0],
    ]);
  });

  it("can get event errors for a machine and no event", () => {
    const machineEventErrors = [
      machineEventErrorFactory({ id: "abc123", event: null }),
      machineEventErrorFactory({ id: "abc123", event: NodeActions.TAG }),
      machineEventErrorFactory({ event: null }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: machineEventErrors,
      }),
    });
    expect(machine.eventErrorsForIds(state, "abc123", null)).toStrictEqual([
      machineEventErrors[0],
    ]);
  });

  it("can get event errors for multiple machines", () => {
    const machineEventErrors = [
      machineEventErrorFactory({ id: "abc123" }),
      machineEventErrorFactory({ id: "def456" }),
      machineEventErrorFactory(),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: machineEventErrors,
      }),
    });
    expect(
      machine.eventErrorsForIds(state, ["abc123", "def456"])
    ).toStrictEqual([machineEventErrors[0], machineEventErrors[1]]);
  });

  it("can get event errors for multiple machines and a provided event", () => {
    const machineEventErrors = [
      machineEventErrorFactory({ id: "abc123", event: NodeActions.TAG }),
      machineEventErrorFactory({ id: "def456", event: NodeActions.TAG }),
      machineEventErrorFactory({ event: NodeActions.TAG }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: machineEventErrors,
      }),
    });
    expect(
      machine.eventErrorsForIds(state, ["abc123", "def456"], NodeActions.TAG)
    ).toStrictEqual([machineEventErrors[0], machineEventErrors[1]]);
  });

  it("can get event errors for multiple machines and no event", () => {
    const machineEventErrors = [
      machineEventErrorFactory({ id: "abc123", event: null }),
      machineEventErrorFactory({ id: "def456", event: null }),
      machineEventErrorFactory({ id: "abc123", event: NodeActions.TAG }),
      machineEventErrorFactory({ id: "def456", event: NodeActions.TAG }),
      machineEventErrorFactory({ event: null }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: machineEventErrors,
      }),
    });
    expect(
      machine.eventErrorsForIds(state, ["abc123", "def456"], null)
    ).toStrictEqual([machineEventErrors[0], machineEventErrors[1]]);
  });
});
