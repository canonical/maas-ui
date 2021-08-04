import { canOpenActionForm } from "./utils";

import { NodeActions } from "app/store/types/node";
import { machine as machineFactory } from "testing/factories";

describe("machines view utils", () => {
  describe("canOpenActionForm", () => {
    it("handles the null case", () => {
      expect(canOpenActionForm(null, null)).toBe(false);
      expect(canOpenActionForm(machineFactory(), null)).toBe(false);
      expect(canOpenActionForm(null, NodeActions.TAG)).toBe(false);
    });

    it("handles whether a machine can open non-clone action forms", () => {
      const machine = machineFactory({ actions: [NodeActions.TAG] });
      expect(canOpenActionForm(machine, NodeActions.TAG)).toBe(true);
      expect(canOpenActionForm(machine, NodeActions.TEST)).toBe(false);
    });

    it("handles whether a machine can open the clone action form", () => {
      const machine = machineFactory({ actions: [] });
      expect(canOpenActionForm(machine, NodeActions.CLONE)).toBe(true);
    });
  });
});
