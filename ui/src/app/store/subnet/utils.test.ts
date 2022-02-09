import { getHasIPAddresses, getSubnetDisplay, isSubnetDetails } from "./utils";

import {
  subnet as subnetFactory,
  subnetIP as subnetIPFactory,
  subnetDetails as subnetDetailsFactory,
} from "testing/factories";

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

  describe("isSubnetDetails", () => {
    it("handles the null case", () => {
      expect(isSubnetDetails()).toBe(false);
      expect(isSubnetDetails(null)).toBe(false);
    });

    it("correctly returns whether a subnet is the detailed type", () => {
      const subnet = subnetFactory();
      const subnetDetails = subnetDetailsFactory();
      expect(isSubnetDetails(subnet)).toBe(false);
      expect(isSubnetDetails(subnetDetails)).toBe(true);
    });
  });
});

describe("getHasIPAddresses", function () {
  it("handles no arguments provided", function () {
    expect(getHasIPAddresses()).toBe(false);
  });

  it("handles non-details subnets", function () {
    const subnet = subnetFactory();
    expect(getHasIPAddresses(subnet)).toBe(false);
  });

  it("returns true if argument has IP addresses", function () {
    const subnet = subnetDetailsFactory({ ip_addresses: [subnetIPFactory()] });
    expect(getHasIPAddresses(subnet)).toBe(true);
  });

  it("returns false if argument has no IP addresses", function () {
    const subnet = subnetDetailsFactory({ ip_addresses: [] });
    expect(getHasIPAddresses(subnet)).toBe(false);
  });
});
