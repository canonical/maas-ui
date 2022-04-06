/* Copyright 2015 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Unit tests for TagsManager.
 */
import angular from "angular";

describe("TagsManager", function () {
  // Load the MAAS module.
  beforeEach(angular.mock.module("MAAS"));

  // Load the TagsManager.
  let TagsManager, RegionConnection;
  beforeEach(inject(function ($injector) {
    TagsManager = $injector.get("TagsManager");
    RegionConnection = $injector.get("RegionConnection");
  }));

  it("set requires attributes", function () {
    expect(TagsManager._pk).toBe("id");
    expect(TagsManager._handler).toBe("tag");
  });

  describe("autocomplete", function () {
    it("returns array of matching tags", function () {
      var tags = ["apple", "banana", "cake", "donut"];
      angular.forEach(tags, function (tag, i) {
        TagsManager._items.push({ name: tag, id: i });
      });
      expect(TagsManager.autocomplete("a")).toStrictEqual([
        "apple",
        "banana",
        "cake",
      ]);
      expect(TagsManager.autocomplete("do")).toStrictEqual(["donut"]);
    });
  });

  describe("create", function () {
    it("calls the region with expected parameters", function () {
      var result = {};
      spyOn(RegionConnection, "callMethod").and.returnValue(result);
      expect(TagsManager.create("new-tag")).toBe(result);
      expect(RegionConnection.callMethod).toHaveBeenCalledWith("tag.create", {
        name: "new-tag",
      });
    });
  });
});
