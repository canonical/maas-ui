import selectors from "./selectors";

import { HardwareType } from "app/base/enum";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "app/store/scriptresult/types";
import {
  nodeScriptResultState as nodeScriptResultStateFactory,
  partialScriptResult as partialScriptResultFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultData as scriptResultDataFactory,
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

  it("returns script results by id", () => {
    const items = [
      scriptResultFactory({ id: 1 }),
      scriptResultFactory({ id: 2 }),
      scriptResultFactory({ id: 3 }),
    ];
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2] },
      }),
    });
    expect(selectors.getById(state, 2)).toStrictEqual(items[1]);
  });

  it("returns script results by node id", () => {
    const resultsForNode = [
      scriptResultFactory({ id: 1 }),
      scriptResultFactory({ id: 2 }),
    ];
    const items = [...resultsForNode, scriptResultFactory({ id: 3 })];
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2] },
      }),
    });
    expect(selectors.getByNodeId(state, "abc123")).toStrictEqual(
      resultsForNode
    );
  });

  it("handles no script results for a node", () => {
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
    expect(selectors.getByNodeId(state, "abc123")).toStrictEqual(null);
  });

  it("returns hardware testing script results by node id", () => {
    const hardwareResultsForNode = [
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
      ...hardwareResultsForNode,
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

    expect(selectors.getHardwareTestingByNodeId(state, "abc123")).toStrictEqual(
      hardwareResultsForNode
    );
  });

  it("returns failed hardware testing script results by node id", () => {
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
      selectors.getHardwareTestingByNodeId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns commissioning script results by node id", () => {
    const commissioningResultsForNode = scriptResultFactory({
      id: 1,
      hardware_type: HardwareType.Node,
      result_type: ScriptResultType.COMMISSIONING,
    });

    const items = [
      commissioningResultsForNode,
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

    expect(selectors.getCommissioningByNodeId(state, "abc123")).toStrictEqual([
      commissioningResultsForNode,
    ]);
  });

  it("returns network testing script results by node id", () => {
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

    expect(selectors.getNetworkTestingByNodeId(state, "abc123")).toStrictEqual([
      items[1],
    ]);
  });

  it("returns failed network testing script results by node id", () => {
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
      selectors.getNetworkTestingByNodeId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns storage testing script results by node id", () => {
    const storageResultsForNode = scriptResultFactory({
      id: 1,
      hardware_type: HardwareType.Storage,
      result_type: ScriptResultType.TESTING,
    });

    const items = [
      storageResultsForNode,
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

    expect(selectors.getStorageTestingByNodeId(state, "abc123")).toStrictEqual([
      storageResultsForNode,
    ]);
  });

  it("returns failed storage testing script results by node id", () => {
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
      selectors.getStorageTestingByNodeId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns other testing script results by node id", () => {
    const otherResultsForNode = scriptResultFactory({
      id: 1,
      hardware_type: HardwareType.Node,
      result_type: ScriptResultType.TESTING,
    });

    const items = [
      otherResultsForNode,
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

    expect(selectors.getOtherTestingByNodeId(state, "abc123")).toStrictEqual([
      otherResultsForNode,
    ]);
  });

  it("returns other failed testing script results by node id", () => {
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
      selectors.getOtherTestingByNodeId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns failed testing script results for node ids", () => {
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
      selectors.getFailedTestingResultsByNodeIds(state, ["abc123", "def456"])
    ).toStrictEqual({
      abc123: [items[0], items[1]],
      def456: [items[3]],
    });
  });

  it("returns installation script results by node id", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.CPU,
        result_type: ScriptResultType.INSTALLATION,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.INSTALLATION,
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
        items: { abc123: [1, 2, 3] },
      }),
    });

    expect(selectors.getInstallationByNodeId(state, "abc123")).toStrictEqual([
      items[0],
      items[1],
    ]);
  });

  it("returns failed installation script results by node id", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.INSTALLATION,
        status: ScriptResultStatus.FAILED,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.INSTALLATION,
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
      selectors.getInstallationByNodeId(state, "abc123", true)
    ).toStrictEqual([items[0]]);
  });

  it("returns installation script logs by node id", () => {
    const items = [
      scriptResultFactory({
        id: 1,
        hardware_type: HardwareType.CPU,
        result_type: ScriptResultType.INSTALLATION,
      }),
      scriptResultFactory({
        id: 2,
        hardware_type: HardwareType.Network,
        result_type: ScriptResultType.INSTALLATION,
      }),
    ];
    const logs = {
      1: scriptResultDataFactory(),
      2: scriptResultDataFactory(),
      3: scriptResultDataFactory(),
    };
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        items,
        logs,
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1, 2, 3] },
      }),
    });

    expect(
      selectors.getInstallationLogsByNodeId(state, "abc123")
    ).toStrictEqual([logs["1"], logs["2"]]);
  });

  it("returns a log by id", () => {
    const logs = {
      1: scriptResultDataFactory(),
      2: scriptResultDataFactory(),
    };
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        logs,
      }),
    });
    expect(selectors.getLogById(state, 2)).toStrictEqual(logs["2"]);
  });

  it("returns history by id", () => {
    const history = {
      1: [partialScriptResultFactory()],
      2: [partialScriptResultFactory()],
    };
    const state = rootStateFactory({
      scriptresult: scriptResultStateFactory({
        history,
      }),
    });
    expect(selectors.getHistoryById(state, 2)).toStrictEqual(history["2"]);
  });
});
