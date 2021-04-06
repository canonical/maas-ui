import { memoryWithUnit } from "./utils";

describe("kvm utils", () => {
  describe("memoryWithUnit", () => {
    it("correctly formats memory in bytes to a readable string", () => {
      expect(memoryWithUnit(0)).toBe("0B");
      expect(memoryWithUnit(1)).toBe("1B");
      expect(memoryWithUnit(1024)).toBe("1KiB");
      expect(memoryWithUnit(5000000000)).toBe("4.66GiB");
    });
  });
});
