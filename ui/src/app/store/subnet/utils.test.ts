import { getSubnetDisplay } from "./utils";

import { subnet as subnetFactory } from "testing/factories";

describe("subnet utils", () => {
  describe("getSubnetDisplay", function () {
    it("returns 'Unconfigured' for null", function () {
      expect(getSubnetDisplay(null)).toBe("Unconfigured");
    });

    it("returns just cidr if name same as cidr", function () {
      const subnet = subnetFactory({ cidr: "same-name", name: "same-name" });
      expect(getSubnetDisplay(subnet)).toBe("same-name");
    });

    it("returns cidr + name", function () {
      const subnet = subnetFactory({ cidr: "cidr-name", name: "subnet-name" });
      expect(getSubnetDisplay(subnet)).toBe("cidr-name (subnet-name)");
    });

    it("can return the short name instead of cidr + name", function () {
      const subnet = subnetFactory({ cidr: "cidr-name", name: "subnet-name" });
      expect(getSubnetDisplay(subnet, true)).toBe("cidr-name");
    });
  });
});
