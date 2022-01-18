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
  var TagsManager;
  beforeEach(inject(function ($injector) {
    TagsManager = $injector.get("TagsManager");
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
        { name: "apple", id: 0 },
        { name: "banana", id: 1 },
        { name: "cake", id: 2 },
      ]);
      expect(TagsManager.autocomplete("do")).toStrictEqual([
        { name: "donut", id: 3 },
      ]);
    });
  });
});
