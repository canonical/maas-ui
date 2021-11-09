import { getSortedPoolsArray, memoryWithUnit } from "./utils";

import {
  podStoragePoolResource as podPoolFactory,
  vmClusterStoragePoolResource as vmPoolFactory,
} from "testing/factories";

describe("kvm utils", () => {
  describe("memoryWithUnit", () => {
    it("correctly formats memory in bytes to a readable string", () => {
      expect(memoryWithUnit(0)).toBe("0B");
      expect(memoryWithUnit(1)).toBe("1B");
      expect(memoryWithUnit(1024)).toBe("1KiB");
      expect(memoryWithUnit(5000000000)).toBe("4.66GiB");
    });
  });

  describe("getSortedPoolsArray", () => {
    it("correctly returns a sorted array of pools in a pod", () => {
      const poolA = podPoolFactory({ id: "a" });
      const poolB = podPoolFactory({ id: "b" });
      const poolC = podPoolFactory({ id: "c" });
      const pools = {
        poolC,
        poolB,
        poolA,
      };
      const defaultPoolId = "b";
      expect(getSortedPoolsArray(pools, defaultPoolId)).toStrictEqual([
        ["poolB", poolB],
        ["poolA", poolA],
        ["poolC", poolC],
      ]);
    });

    it("correctly returns a sorted array of pools in a cluster", () => {
      const poolA = vmPoolFactory();
      const poolB = vmPoolFactory();
      const poolC = vmPoolFactory();
      const pools = {
        poolC,
        poolA,
        poolB,
      };
      expect(getSortedPoolsArray(pools)).toStrictEqual([
        ["poolA", poolA],
        ["poolB", poolB],
        ["poolC", poolC],
      ]);
    });
  });
});
