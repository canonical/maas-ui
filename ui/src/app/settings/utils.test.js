import { simpleObjectEquality } from "./utils";

describe("settings utils", () => {
  describe("simpleObjectEquality", () => {
    it("returns true if two objects have the same key value pairs in the same order", () => {
      const obj1 = { key1: "value1", key2: "value2" };
      const obj2 = { key1: "value1", key2: "value2" };
      expect(simpleObjectEquality(obj1, obj2)).toBe(true);
    });
  });
});
