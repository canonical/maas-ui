import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResults as scriptResultsFactory,
  scriptResultsState as scriptResultsStateFactory,
} from "testing/factories";
import machine from "./selectors";

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

  it("can get the error state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        errors: "Uh oh!",
        items: [],
        loaded: true,
      }),
    });
    expect(machine.errors(state)).toEqual("Uh oh!");
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

  it("returns failed script results for selected machines", () => {
    const scriptResults = {
      foo: [scriptResultFactory()],
      bar: [scriptResultFactory()],
      baz: [scriptResultFactory()],
    };
    const items = [
      machineFactory({ system_id: "foo" }),
      machineFactory({ system_id: "bar" }),
      machineFactory(),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items,
        selected: ["foo", "bar"],
      }),
      scriptresults: scriptResultsStateFactory({
        items: scriptResultsFactory(scriptResults),
      }),
    });

    expect(machine.failedScriptResults(state)).toEqual({
      foo: scriptResults.foo,
      bar: scriptResults.bar,
    });
  });
});
