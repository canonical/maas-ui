import {
  getInterfaceMembers,
  getInterfaceNumaNodes,
  getInterfaceTypeText,
  isBootInterface,
  isInterfaceConnected,
} from "./networking";

import { BridgeType, NetworkInterfaceTypes } from "app/store/machine/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
} from "testing/factories";

describe("machine networking utils", () => {
  describe("getInterfaceMembers", () => {
    it("gets members for a bond", () => {
      const interfaces = [
        machineInterfaceFactory(),
        machineInterfaceFactory(),
        machineInterfaceFactory(),
      ];
      const nic = machineInterfaceFactory({
        parents: [interfaces[0].id, interfaces[2].id],
        type: NetworkInterfaceTypes.BOND,
      });
      interfaces.push(nic);
      const machine = machineDetailsFactory({ interfaces });
      expect(getInterfaceMembers(machine, nic)).toStrictEqual([
        interfaces[0],
        interfaces[2],
      ]);
    });

    it("gets members for a bridge", () => {
      const interfaces = [
        machineInterfaceFactory(),
        machineInterfaceFactory(),
        machineInterfaceFactory(),
      ];
      const nic = machineInterfaceFactory({
        parents: [interfaces[0].id, interfaces[2].id],
        type: NetworkInterfaceTypes.BRIDGE,
      });
      interfaces.push(nic);
      const machine = machineDetailsFactory({ interfaces });
      expect(getInterfaceMembers(machine, nic)).toStrictEqual([
        interfaces[0],
        interfaces[2],
      ]);
    });

    it("does not get members for other types", () => {
      const interfaces = [
        machineInterfaceFactory(),
        machineInterfaceFactory(),
        machineInterfaceFactory(),
      ];
      const nic = machineInterfaceFactory({
        parents: [interfaces[0].id, interfaces[2].id],
        type: NetworkInterfaceTypes.ALIAS,
      });
      interfaces.push(nic);
      const machine = machineDetailsFactory({ interfaces });
      expect(getInterfaceMembers(machine, nic)).toStrictEqual([]);
    });
  });

  describe("getInterfaceNumaNodes", () => {
    it("returns an interface's numa node if it has no parents", () => {
      const nic = machineInterfaceFactory({
        numa_node: 2,
        parents: [],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceNumaNodes(machine, nic)).toEqual([2]);
    });

    it("returns numa nodes of interface and its parents", () => {
      const interfaces = [
        machineInterfaceFactory({ numa_node: 1 }),
        machineInterfaceFactory({ numa_node: 3 }),
        machineInterfaceFactory({ numa_node: 0 }),
      ];
      const nic = machineInterfaceFactory({
        numa_node: 2,
        parents: [interfaces[0].id, interfaces[2].id],
      });
      interfaces.push(nic);
      const machine = machineDetailsFactory({ interfaces });
      expect(getInterfaceNumaNodes(machine, nic)).toEqual([0, 1, 2]);
    });
  });

  describe("getInterfaceTypeText", function () {
    it("returns the text for standard types", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
      });
      expect(getInterfaceTypeText(nic)).toBe("VLAN");
    });

    it("returns correct text if bridge type is OVS", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.BRIDGE,
        params: { bridge_type: BridgeType.OVS },
      });
      expect(getInterfaceTypeText(nic)).toBe("Open vSwitch");
    });

    it("returns correct text if physical interface has a child with bond type", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.BOND,
      });
      const parent = machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      expect(getInterfaceTypeText(nic, parent)).toBe("Bonded physical");
    });

    it("returns correct text if physical interface has a child with bridge type", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.BRIDGE,
      });
      const parent = machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      expect(getInterfaceTypeText(nic, parent)).toBe("Bridged physical");
    });
  });

  describe("isBootInterface", () => {
    it("checks if the nic is a boot interface", () => {
      const nic = machineInterfaceFactory({
        is_boot: true,
        type: NetworkInterfaceTypes.BRIDGE,
      });
      const machine = machineDetailsFactory();
      expect(isBootInterface(machine, nic)).toBe(true);
    });

    it("checks that the nic is not an alias", () => {
      const nic = machineInterfaceFactory({
        is_boot: true,
        type: NetworkInterfaceTypes.ALIAS,
      });
      const machine = machineDetailsFactory();
      expect(isBootInterface(machine, nic)).toBe(false);
    });

    it("checks members for a boot interface", () => {
      const interfaces = [
        machineInterfaceFactory(),
        machineInterfaceFactory(),
        machineInterfaceFactory({ is_boot: true }),
      ];
      const nic = machineInterfaceFactory({
        is_boot: false,
        parents: [interfaces[0].id, interfaces[2].id],
        type: NetworkInterfaceTypes.BRIDGE,
      });
      interfaces.push(nic);
      const machine = machineDetailsFactory({ interfaces });
      expect(isBootInterface(machine, nic)).toBe(true);
    });

    it("is not a boot interface if there are no members with is_boot", () => {
      const interfaces = [
        machineInterfaceFactory({ is_boot: false }),
        machineInterfaceFactory(),
        machineInterfaceFactory({ is_boot: false }),
      ];
      const nic = machineInterfaceFactory({
        is_boot: false,
        parents: [interfaces[0].id, interfaces[2].id],
        type: NetworkInterfaceTypes.BRIDGE,
      });
      interfaces.push(nic);
      const machine = machineDetailsFactory({ interfaces });
      expect(isBootInterface(machine, nic)).toBe(false);
    });
  });

  describe("isInterfaceConnected", () => {
    it("checks if the interface itself is connected", () => {
      const nic = machineInterfaceFactory({
        link_connected: true,
      });
      expect(isInterfaceConnected(nic)).toEqual(true);
    });

    it("checks if the interface itself is not connected", () => {
      const nic = machineInterfaceFactory({
        link_connected: false,
      });
      expect(isInterfaceConnected(nic)).toEqual(false);
    });
  });
});
