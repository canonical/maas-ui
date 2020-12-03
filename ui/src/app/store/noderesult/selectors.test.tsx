import selectors from "./selectors";

import { HardwareType, ResultType } from "app/base/enum";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  nodeResult as nodeResultFactory,
  nodeResultState as nodeResultStateFactory,
} from "testing/factories";

describe("nodeResults selectors", () => {
  it("returns all node results", () => {
    const fooResults = [nodeResultFactory(), nodeResultFactory()];
    const barResults = [nodeResultFactory(), nodeResultFactory()];

    const state = rootStateFactory({
      noderesult: nodeResultStateFactory({
        items: [
          { id: "foo", results: fooResults },
          { id: "bar", results: barResults },
        ],
      }),
    });

    expect(selectors.all(state)).toEqual([
      {
        id: "foo",
        results: fooResults,
      },
      { id: "bar", results: barResults },
    ]);
  });

  it("returns node results for given machines ids", () => {
    const result1 = nodeResultFactory({ id: 1 });
    const result2 = nodeResultFactory({ id: 2 });
    const result3 = nodeResultFactory({ id: 3 });

    const items = [
      machineFactory({ system_id: "foo" }),
      machineFactory({ system_id: "bar" }),
      machineFactory({ system_id: "baz" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items,
      }),
      noderesult: nodeResultStateFactory({
        items: [
          {
            id: "foo",
            results: [result1],
          },
          {
            id: "bar",
            results: [result2],
          },
          { id: "baz", results: [result3] },
        ],
      }),
    });

    expect(selectors.getByIds(state, ["foo", "baz"])).toHaveLength(2);
    expect(selectors.getByIds(state, ["foo", "bar"])[0].id).toEqual("foo");
    expect(selectors.getByIds(state, ["foo", "baz"])[1].id).toEqual("baz");
  });

  it("returns the loading state", () => {
    const state = rootStateFactory({
      noderesult: nodeResultStateFactory({
        loading: true,
      }),
    });

    expect(selectors.loading(state)).toEqual(true);
  });

  it("returns the errors state", () => {
    const state = rootStateFactory({
      noderesult: nodeResultStateFactory({
        errors: "Data is incorrect",
      }),
    });

    expect(selectors.errors(state)).toStrictEqual("Data is incorrect");
  });

  describe("testing results", () => {
    it("returns hardware testing results", () => {
      const cpuResult = nodeResultFactory({
        hardware_type: HardwareType.CPU,
        result_type: ResultType.Testing,
      });
      const memoryResult = nodeResultFactory({
        hardware_type: HardwareType.Memory,
        result_type: ResultType.Testing,
      });
      const storageResult = nodeResultFactory({
        hardware_type: HardwareType.Storage,
        result_type: ResultType.Testing,
      });
      const commissioningResult = nodeResultFactory({
        result_type: ResultType.Commissioning,
      });

      const results = [
        cpuResult,
        memoryResult,
        storageResult,
        commissioningResult,
      ];

      const state = rootStateFactory({
        noderesult: nodeResultStateFactory({
          items: [{ id: "foo", results }],
        }),
      });

      expect(selectors.getHardwareTestingResults(state, "foo")).toEqual([
        cpuResult,
        memoryResult,
      ]);
    });

    it("returns storage testing results", () => {
      const cpuResult = nodeResultFactory({
        hardware_type: HardwareType.CPU,
        result_type: ResultType.Testing,
      });
      const memoryResult = nodeResultFactory({
        hardware_type: HardwareType.Memory,
        result_type: ResultType.Testing,
      });
      const storageResult = nodeResultFactory({
        hardware_type: HardwareType.Storage,
        result_type: ResultType.Testing,
      });
      const commissioningResult = nodeResultFactory({
        result_type: ResultType.Commissioning,
      });

      const results = [
        cpuResult,
        memoryResult,
        storageResult,
        commissioningResult,
      ];

      const state = rootStateFactory({
        noderesult: nodeResultStateFactory({
          items: [{ id: "foo", results }],
        }),
      });

      expect(selectors.getStorageTestingResults(state, "foo")).toEqual([
        storageResult,
      ]);
    });

    it("returns 'other' testing results", () => {
      const cpuResult = nodeResultFactory({
        hardware_type: HardwareType.CPU,
        result_type: ResultType.Testing,
      });
      const nodeResult = nodeResultFactory({
        hardware_type: HardwareType.Node,
        result_type: ResultType.Testing,
      });
      const nodeCommissioningResult = nodeResultFactory({
        hardware_type: HardwareType.Node,
        result_type: ResultType.Commissioning,
      });

      const results = [cpuResult, nodeResult, nodeCommissioningResult];

      const state = rootStateFactory({
        noderesult: nodeResultStateFactory({
          items: [{ id: "foo", results }],
        }),
      });

      expect(selectors.getOtherTestingResults(state, "foo")).toEqual([
        nodeResult,
      ]);
    });
  });
});
