import { getVLANDisplay } from "./utils";

import { VlanVid } from "app/store/vlan/types";
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

    it("can display as untagged", () => {
      const vlan = vlanFactory({ vid: VlanVid.UNTAGGED });
      expect(getVLANDisplay(vlan)).toBe("untagged");
    });

    it("returns vid + name", () => {
      const vlan = vlanFactory({ vid: 5, name: "vlan-name" });
      expect(getVLANDisplay(vlan)).toBe("5 (vlan-name)");
    });
  });
});
