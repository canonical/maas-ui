import { FilterDevices, getDeviceValue } from "./search";

import type { Filters } from "app/utils/search/filter-handlers";
import { device as deviceFactory } from "testing/factories";

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
      const device = deviceFactory({ tags: ["tag1", "tag2"] });
      expect(getDeviceValue(device, "tags")).toStrictEqual(["tag1", "tag2"]);
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
