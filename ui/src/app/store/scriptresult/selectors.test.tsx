import selectors from "./selectors";

import { HardwareType } from "app/base/enum";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "app/store/scriptresult/types";
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
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.TESTING,
      }),
    ];
    const items = [
      ...hardwareResultsForMachine,
      scriptResultFactory({
        id: 3,
        hardware_type: HardwareType.Storage,
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 4,
        result_type: ScriptResultType.COMMISSIONING,
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

  it("returns failed hardware testing script results by machine id", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.CPU,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.TESTING,
      }),
    ];
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2] },
      }),
    });
    expect(
      selectors.getHardwareTestingByMachineId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns commissioning script results by machine id", () => {
    const commissioningResultsForMachine = scriptResultFactory({
      id: 1,
      hardware_type: HardwareType.Node,
      result_type: ScriptResultType.COMMISSIONING,
    });

    const items = [
      commissioningResultsForMachine,
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.CPU,
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 3,
        result_type: ScriptResultType.INSTALLATION,
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
      selectors.getCommissioningByMachineId(state, "abc123")
    ).toStrictEqual([commissioningResultsForMachine]);
  });

  it("returns network testing script results by machine id", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.CPU,
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 3,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.TESTING,
      }),
    ];

    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2] },
      }),
    });

    expect(
      selectors.getNetworkTestingByMachineId(state, "abc123")
    ).toStrictEqual([items[1]]);
  });

  it("returns failed network testing script results by machine id", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.TESTING,
      }),
    ];
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2] },
      }),
    });
    expect(
      selectors.getNetworkTestingByMachineId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns storage testing script results by machine id", () => {
    const storageResultsForMachine = scriptResultFactory({
      id: 1,
      hardware_type: HardwareType.Storage,
      result_type: ScriptResultType.TESTING,
    });

    const items = [
      storageResultsForMachine,
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.CPU,
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 3,
        result_type: ScriptResultType.COMMISSIONING,
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

  it("returns failed storage testing script results by machine id", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.Storage,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Storage,
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 3,
        result_type: ScriptResultType.COMMISSIONING,
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
      selectors.getStorageTestingByMachineId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns other testing script results by machine id", () => {
    const otherResultsForMachine = scriptResultFactory({
      id: 1,
      hardware_type: HardwareType.Node,
      result_type: ScriptResultType.TESTING,
    });

    const items = [
      otherResultsForMachine,
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.CPU,
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 3,
        result_type: ScriptResultType.COMMISSIONING,
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

  it("returns other failed testing script results by machine id", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.Node,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Node,
        result_type: ScriptResultType.TESTING,
      }),
      scriptResultFactory({
        id: 3,
        result_type: ScriptResultType.COMMISSIONING,
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
      selectors.getOtherTestingByMachineId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns failed testing script results for machine ids", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.CPU,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
      }),
      // Should not be returned because it passed.
      scriptResultFactory({
        id: 3,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.PASSED,
      }),
      scriptResultFactory({
        id: 4,
        hardware_type: HardwareType.Storage,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
      }),
      // Should not be returned because it is not a testing script.
      scriptResultFactory({
        id: 5,
        result_type: ScriptResultType.COMMISSIONING,
        status: ScriptResultStatus.FAILED,
      }),
      // Should not be returned because it passed.
      scriptResultFactory({
        id: 6,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.PASSED,
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
