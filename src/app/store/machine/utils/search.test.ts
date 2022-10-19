import type { FetchFilters } from "../types/actions";

import { FilterMachines, getMachineValue, FilterMachineItems } from "./search";

import type { Filters } from "app/utils/search/filter-handlers";
import {
  machine as machineFactory,
  tag as tagFactory,
} from "testing/factories";

const scenarios: {
  filters: FetchFilters;
  input: string;
  output?: string;
}[] = [
  { input: "system_id:abc123", filters: { id: ["abc123"] } },
  {
    input: "cores:1",
    filters: {
      cpu_count: [1],
    },
  },
  {
    input: "cpu:1",
    filters: {
      cpu_count: [1],
    },
  },
  {
    input: "cpu:1 cores:2",
    filters: {
      cpu_count: [1, 2],
    },
  },
  {
    input: "mac:aa:bb:cc:dd",
    filters: {
      mac_address: ["aa:bb:cc:dd"],
    },
  },
  {
    input: "ram:1",
    filters: {
      mem: [1],
    },
  },
  {
    input: "release:ubuntu/jammy",
    filters: {
      osystem: ["ubuntu"],
      distro_series: ["jammy"],
    },
  },
  {
    input: "vlan:vlan1",
    filters: {
      vlans: ["vlan1"],
    },
  },
  {
    input: "vlan:vlan1,!vlan2",
    filters: {
      vlans: ["vlan1"],
      not_vlans: ["vlan2"],
    },
  },
  {
    input: "workload-type:()",
    filters: {
      workloads: ["type:"],
    },
  },
  {
    input: "workload-type:(qwerty)",
    filters: {
      workloads: ["type:qwerty"],
    },
  },
  {
    input: "free-text workload-type:(qwerty) workload-service:(dvorak)",
    filters: {
      free_text: ["free-text"],
      workloads: ["type:qwerty", "service:dvorak"],
    },
  },
  {
    input: "workload-type:(query with spaces)",
    filters: {
      workloads: ["type:query with spaces"],
    },
  },
];

describe("parseFetchFilters", () => {
  scenarios.forEach((scenario) => {
    it(`can parse: ${scenario.input}`, () => {
      expect(FilterMachineItems.parseFetchFilters(scenario.input)).toEqual(
        scenario.filters
      );
    });
  });
});

it("workload annotation is active if key exists in filter list", () => {
  expect(
    FilterMachineItems.isFilterActive(
      {
        "workload-type": ["type:production"],
      },
      "workloads",
      "type"
    )
  ).toBe(true);
});

// TODO: remove these tests once all the machine lists have all been migrated to the
// new search API and methods:
// https://github.com/canonical/app-tribe/issues/1279
describe("client side search", () => {
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

it("isNonEmptyFilter returns false for empty search string", () => {
  expect(FilterMachineItems.isNonEmptyFilter("")).toBe(false);
});

it("isNonEmptyFilter returns true for defined search string", () => {
  expect(FilterMachineItems.isNonEmptyFilter("status:(=broken)")).toBe(true);
});
