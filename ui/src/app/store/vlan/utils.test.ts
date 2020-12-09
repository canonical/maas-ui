import { getVLANDisplay } from "./utils";

import { vlan as vlanFactory } from "testing/factories";

describe("vlan utils", () => {
  describe("getVLANDisplay", () => {
    it("returns nothing if vlan undefined", () => {
      expect(getVLANDisplay(null)).toBe(null);
    });

    it("returns just vid", () => {
      const vlan = vlanFactory({ vid: 5, name: "" });
      expect(getVLANDisplay(vlan)).toBe("5");
    });

    it("returns vid + name", () => {
      const vlan = vlanFactory({ vid: 5, name: "vlan-name" });
      expect(getVLANDisplay(vlan)).toBe("5 (vlan-name)");
    });
  });
});
