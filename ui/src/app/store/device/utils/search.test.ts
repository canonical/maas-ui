import { FilterDevices, getDeviceValue } from "./search";

import type { Filters } from "app/utils/search/filter-handlers";
import { device as deviceFactory, tag as tagFactory } from "testing/factories";

describe("search", () => {
  describe("getDeviceValue", () => {
    it("can get an attribute via a mapping function", () => {
      const device = deviceFactory({ zone: { id: 1, name: "danger" } });
      expect(getDeviceValue(device, "zone")).toBe("danger");
    });

    it("can get an attribute directly from the device", () => {
      const device = deviceFactory({ hostname: "miami-device" });
      expect(getDeviceValue(device, "hostname")).toBe("miami-device");
    });

    it("can get an attribute that is an array directly from the device", () => {
      const device = deviceFactory({ fabrics: ["fabric-0", "fabric-1"] });
      expect(getDeviceValue(device, "fabrics")).toStrictEqual([
        "fabric-0",
        "fabric-1",
      ]);
    });

    it("can get tags", () => {
      const tags = [
        tagFactory({ id: 1, name: "tag1" }),
        tagFactory({ id: 2, name: "tag2" }),
        tagFactory({ id: 3, name: "tag3" }),
      ];
      const device = deviceFactory({ tags: [1, 2] });
      expect(getDeviceValue(device, "tags", { tags })).toStrictEqual([
        "tag1",
        "tag2",
      ]);
    });
  });

  describe("FilterDevice", () => {
    const scenarios: {
      filters: Filters;
      input: string;
      output?: string;
    }[] = [
      {
        input: "free-text",
        filters: {
          q: ["free-text"],
        },
      },
      {
        input: "hostname:(miami)",
        filters: {
          q: [],
          hostname: ["miami"],
        },
      },
      {
        input: "tags:(tag1,tag2)",
        filters: {
          q: [],
          tags: ["tag1", "tag2"],
        },
      },
      {
        input: "free-text hostname:(miami) tags:(tag1,tag2)",
        filters: {
          q: ["free-text"],
          hostname: ["miami"],
          tags: ["tag1", "tag2"],
        },
      },
    ];

    scenarios.forEach((scenario) => {
      describe("input:" + scenario.input, () => {
        it("getCurrentFilters", () => {
          expect(FilterDevices.getCurrentFilters(scenario.input)).toEqual(
            scenario.filters
          );
        });
      });
    });
  });
});
