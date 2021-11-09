import { canOpenActionForm } from "./utils";

import { NodeActions, NodeStatus } from "app/store/types/node";
import { machine as machineFactory } from "testing/factories";

describe("machines view utils", () => {
  describe.only("canOpenActionForm", () => {
    it.only("handles the null case", () => {
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
      const machine1 = machineFactory({
        actions: [NodeActions.CLONE],
        status: NodeStatus.READY,
      });
      const machine2 = machineFactory({
        actions: [],
        status: NodeStatus.READY,
      });
      const machine3 = machineFactory({
        actions: [NodeActions.CLONE],
        status: NodeStatus.NEW,
      });
      const machine4 = machineFactory({
        actions: [],
        status: NodeStatus.NEW,
      });
      expect(canOpenActionForm(machine1, NodeActions.CLONE)).toBe(true);
      expect(canOpenActionForm(machine2, NodeActions.CLONE)).toBe(true);
      expect(canOpenActionForm(machine3, NodeActions.CLONE)).toBe(false);
      expect(canOpenActionForm(machine4, NodeActions.CLONE)).toBe(false);
    });
  });
});
