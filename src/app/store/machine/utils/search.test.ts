import { FilterMachines, getMachineValue } from "./search";

import type { Filters } from "app/utils/search/filter-handlers";
import {
  machine as machineFactory,
  tag as tagFactory,
} from "testing/factories";

describe("search", () => {
  describe("getMachineValue", () => {
    it("can get an attribute via a mapping function", () => {
      const machine = machineFactory({ hostname: "machine1" });
      expect(getMachineValue(machine, "hostname")).toBe("machine1");
    });

    it("can get an attribute directly from the machine", () => {
      const machine = machineFactory({ id: 808 });
      expect(getMachineValue(machine, "id")).toBe(808);
    });

    it("can get an attribute that is an array directly from the machine", () => {
      const machine = machineFactory({ link_speeds: [1, 2] });
      expect(getMachineValue(machine, "link_speeds")).toStrictEqual([1, 2]);
    });

    it("can get a workload annotation value", () => {
      const machine = machineFactory({
        workload_annotations: { type: "production" },
      });
      expect(getMachineValue(machine, "workload-type")).toBe("production");
    });

    it("can get tags", () => {
      const tags = [
        tagFactory({ id: 1, name: "tag1" }),
        tagFactory({ id: 2, name: "tag2" }),
        tagFactory({ id: 3, name: "tag3" }),
      ];
      const machine = machineFactory({
        tags: [1, 2],
      });
      expect(getMachineValue(machine, "tags", { tags })).toStrictEqual([
        "tag1",
        "tag2",
      ]);
    });
  });

  describe("FilterMachines", () => {
    const scenarios: {
      filters: Filters;
      input: string;
      output?: string;
    }[] = [
      {
        input: "workload-type:()",
        filters: {
          q: [],
          "workload-type": [""],
        },
      },
      {
        input: "workload-type:(qwerty)",
        filters: {
          q: [],
          "workload-type": ["qwerty"],
        },
      },
      {
        input: "free-text workload-type:(qwerty) workload-service:(dvorak)",
        filters: {
          q: ["free-text"],
          "workload-type": ["qwerty"],
          "workload-service": ["dvorak"],
        },
      },
      {
        input: "workload-type:(query with spaces)",
        filters: {
          q: [],
          "workload-type": ["query with spaces"],
        },
      },
    ];

    scenarios.forEach((scenario) => {
      describe("input:" + scenario.input, () => {
        it("getCurrentFilters", () => {
          expect(FilterMachines.getCurrentFilters(scenario.input)).toEqual(
            scenario.filters
          );
        });
      });
    });

    describe("isFilterActive", () => {
      it("returns true if workload annotation key exists in filter list", () => {
        expect(
          FilterMachines.isFilterActive(
            {
              "workload-type": ["production"],
            },
            "workload_annotations",
            "type"
          )
        ).toBe(true);
      });
    });
  });
});
