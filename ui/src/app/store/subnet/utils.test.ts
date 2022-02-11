import { IPAddressType } from "./types";
import {
  getHasIPAddresses,
  getIPTypeDisplay,
  getIPUsageDisplay,
  getSubnetDisplay,
  isSubnetDetails,
} from "./utils";

import { NodeType } from "app/store/types/node";
import {
  subnet as subnetFactory,
  subnetDetails as subnetDetailsFactory,
  subnetIP as subnetIPFactory,
  subnetBMC as subnetBMCFactory,
  subnetDNSRecord as subnetDNSRecordFactory,
  subnetIPNodeSummary as nodeSummaryFactory,
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

describe("getIPTypeDisplay", () => {
  it("correctly returns the display text for an IP address type", () => {
    expect(getIPTypeDisplay(IPAddressType.AUTO)).toBe("Automatic");
    expect(getIPTypeDisplay(IPAddressType.DHCP)).toBe("DHCP");
    expect(getIPTypeDisplay(IPAddressType.DISCOVERED)).toBe("Discovered");
    expect(getIPTypeDisplay(IPAddressType.STICKY)).toBe("Sticky");
    expect(getIPTypeDisplay(IPAddressType.USER_RESERVED)).toBe("User reserved");
  });
});

describe("getIPUsageDisplay", () => {
  it("handles an IP used for a container", () => {
    const ip = subnetIPFactory({
      node_summary: nodeSummaryFactory({
        is_container: true,
        node_type: NodeType.DEVICE,
      }),
    });
    expect(getIPUsageDisplay(ip)).toBe("Container");
  });

  it("handles an IP used for a node", () => {
    const ip = subnetIPFactory({
      node_summary: nodeSummaryFactory({
        is_container: false,
        node_type: NodeType.MACHINE,
      }),
    });
    expect(getIPUsageDisplay(ip)).toBe("Machine");
  });

  it("handles an IP used in BMCs", () => {
    const ip = subnetIPFactory({ bmcs: [subnetBMCFactory()] });
    expect(getIPUsageDisplay(ip)).toBe("BMC");
  });

  it("handles an IP used in DNS", () => {
    const ip = subnetIPFactory({ dns_records: [subnetDNSRecordFactory()] });
    expect(getIPUsageDisplay(ip)).toBe("DNS");
  });

  it("handles an IP with unknown usage", () => {
    const ip = subnetIPFactory({
      bmcs: undefined,
      dns_records: undefined,
      node_summary: undefined,
    });
    expect(getIPUsageDisplay(ip)).toBe("Unknown");
  });
});
