import { isMachineDetails } from "./common";

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
});
