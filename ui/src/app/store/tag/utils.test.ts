import { getTagNamesForIds, getTagsDisplay } from "./utils";

import { tag as tagFactory } from "testing/factories";

describe("tag utils", () => {
  describe("getTagsDisplay", () => {
    it("can get tags for display", () => {
      const tags = [tagFactory({ name: "tag1" }), tagFactory({ name: "tag2" })];
      expect(getTagsDisplay(tags)).toBe("tag1, tag2");
    });

    it("handles no tags", () => {
      expect(getTagsDisplay([])).toBe("-");
    });
  });

  describe("getTagNamesForIds", () => {
    it("can map tag ids to names", () => {
      const tags = [
        tagFactory({ id: 1, name: "tag1" }),
        tagFactory({ id: 2, name: "tag2" }),
        tagFactory({ id: 3, name: "tag3" }),
      ];
      expect(getTagNamesForIds([1, 3], tags)).toStrictEqual(["tag1", "tag3"]);
    });
  });
});
