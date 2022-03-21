import { getTagCountsForMachines, isMachineDetails } from "./common";

import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
} from "testing/factories";

describe("common machine utils", () => {
  describe("isMachineDetails", () => {
    it("identifies machine details", () => {
      expect(isMachineDetails(machineDetailsFactory())).toBe(true);
    });

    it("handles a machine", () => {
      expect(isMachineDetails(machineFactory())).toBe(false);
    });

    it("handles no machine", () => {
      expect(isMachineDetails()).toBe(false);
    });

    it("handles null", () => {
      expect(isMachineDetails(null)).toBe(false);
    });
  });

  describe("getTagCountsForMachines", () => {
    it("gets the tag ids and counts", () => {
      const machines = [
        machineFactory({ tags: [1, 2, 3] }),
        machineFactory({ tags: [3, 1, 4] }),
      ];
      expect(getTagCountsForMachines(machines)).toStrictEqual(
        new Map([
          [1, 2],
          [2, 1],
          [3, 2],
          [4, 1],
        ])
      );
    });
  });
});
