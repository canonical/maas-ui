import selectors from "./selectors";

import { HardwareType, ResultType } from "app/base/enum";
import { ExitStatus } from "app/store/scriptresult/types";
import {
  nodeScriptResultState as nodeScriptResultStateFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

describe("scriptResult selectors", () => {
  it("returns all script results", () => {
    const items = [scriptResultFactory(), scriptResultFactory()];
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
    });

    expect(selectors.all(state)).toEqual(items);
  });

  it("returns the loading state", () => {
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        loading: true,
      }),
    });

    expect(selectors.loading(state)).toEqual(true);
  });

  it("returns the loaded state", () => {
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        loaded: true,
      }),
    });

    expect(selectors.loaded(state)).toEqual(true);
  });

  it("returns the errors state", () => {
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        errors: "Data is incorrect",
      }),
    });

    expect(selectors.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("returns script results by machine id", () => {
    const resultsForMachine = [
      scriptResultFactory({ id: 1 }),
      scriptResultFactory({ id: 2 }),
    ];
    const items = [...resultsForMachine, scriptResultFactory({ id: 3 })];
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2] },
      }),
    });
    expect(selectors.getByMachineId(state, "abc123")).toStrictEqual(
      resultsForMachine
    );
  });

  it("handles no script results for a machine", () => {
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items: [
          scriptResultFactory({ id: 1 }),
          scriptResultFactory({ id: 2 }),
          scriptResultFactory({ id: 3 }),
        ],
      }),
      nodescriptresult: nodeScriptResultStateFactory(),
    });
    expect(selectors.getByMachineId(state, "abc123")).toStrictEqual(null);
  });

  it("returns hardware testing script results by machine id", () => {
    const hardwareResultsForMachine = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.CPU,
        result_type: ResultType.Testing,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ResultType.Testing,
      }),
    ];
    const items = [
      ...hardwareResultsForMachine,
      scriptResultFactory({
        id: 3,
        hardware_type: HardwareType.Storage,
        result_type: ResultType.Testing,
      }),
      scriptResultFactory({
        id: 4,
        result_type: ResultType.Commissioning,
      }),
    ];

    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2, 3, 4] },
      }),
    });

    expect(
      selectors.getHardwareTestingByMachineId(state, "abc123")
    ).toStrictEqual(hardwareResultsForMachine);
  });

  it("returns storage testing script results by machine id", () => {
    const storageResultsForMachine = scriptResultFactory({
      id: 1,
      hardware_type: HardwareType.Storage,
      result_type: ResultType.Testing,
    });

    const items = [
      storageResultsForMachine,
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.CPU,
        result_type: ResultType.Testing,
      }),
      scriptResultFactory({
        id: 3,
        result_type: ResultType.Commissioning,
      }),
    ];

    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2, 3] },
      }),
    });

    expect(
      selectors.getStorageTestingByMachineId(state, "abc123")
    ).toStrictEqual([storageResultsForMachine]);
  });

  it("returns other testing script results by machine id", () => {
    const otherResultsForMachine = scriptResultFactory({
      id: 1,
      hardware_type: HardwareType.Node,
      result_type: ResultType.Testing,
    });

    const items = [
      otherResultsForMachine,
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.CPU,
        result_type: ResultType.Testing,
      }),
      scriptResultFactory({
        id: 3,
        result_type: ResultType.Commissioning,
      }),
    ];

    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2, 3] },
      }),
    });

    expect(
      selectors.getOtherTestingByMachineId(state, "abc123")
    ).toStrictEqual([otherResultsForMachine]);
  });

  it("returns failed testing script results for machine ids", () => {
    const items = [
      scriptResultFactory({
        exit_status: 1,
        id: 1,
        hardware_type: HardwareType.CPU,
        result_type: ResultType.Testing,
      }),
      scriptResultFactory({
        exit_status: 1,
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ResultType.Testing,
      }),
      // Should not be returned because it passed.
      scriptResultFactory({
        exit_status: ExitStatus.PASSED,
        id: 3,
        hardware_type: HardwareType.Network,
        result_type: ResultType.Testing,
      }),
      scriptResultFactory({
        exit_status: 1,
        id: 4,
        hardware_type: HardwareType.Storage,
        result_type: ResultType.Testing,
      }),
      // Should not be returned because it is not a testing script.
      scriptResultFactory({
        exit_status: 1,
        id: 5,
        result_type: ResultType.Commissioning,
      }),
      // Should not be returned because it passed.
      scriptResultFactory({
        exit_status: ExitStatus.PASSED,
        id: 6,
        result_type: ResultType.Testing,
      }),
    ];
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2, 3], def456: [4, 5, 6] },
      }),
    });
    expect(
      selectors.getFailedTestingResultsByMachineIds(state, ["abc123", "def456"])
    ).toStrictEqual({
      abc123: [items[0], items[1]],
      def456: [items[3]],
    });
  });
});
