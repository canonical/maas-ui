import {
  canAddAlias,
  getBondOrBridgeChild,
  getBondOrBridgeParents,
  getInterfaceDiscovered,
  getInterfaceFabric,
  getInterfaceIPAddress,
  getInterfaceIPAddressOrMode,
  getInterfaceName,
  getInterfaceNumaNodes,
  getInterfaceSubnet,
  getInterfaceType,
  getInterfaceTypeText,
  getLinkFromNic,
  getLinkInterface,
  getLinkInterfaceById,
  getLinkMode,
  getLinkModeDisplay,
  getNextNicName,
  getRemoveTypeText,
  hasInterfaceType,
  isAlias,
  isBondOrBridgeChild,
  isBondOrBridgeParent,
  isBootInterface,
  isInterfaceConnected,
} from "./networking";

import {
  BridgeType,
  NetworkInterfaceTypes,
  NetworkLinkMode,
} from "app/store/machine/types";
import {
  fabric as fabricFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  networkDiscoveredIP as networkDiscoveredIPFactory,
  networkLink as networkLinkFactory,
  subnet as subnetFactory,
  vlan as vlanFactory,
} from "testing/factories";

describe("machine networking utils", () => {
  describe("getLinkInterface", () => {
    it("can get the interface a link belongs to", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link, networkLinkFactory()],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getLinkInterface(machine, link)).toStrictEqual([nic, 0]);
    });

    it("does not get an interface if a link is not provided", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link, networkLinkFactory()],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getLinkInterface(machine, null)).toStrictEqual([null, null]);
    });
  });

  describe("getLinkInterfaceById", () => {
    it("can get the interface a link belongs to", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link, networkLinkFactory()],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getLinkInterfaceById(machine, link.id)).toStrictEqual([nic, 0]);
    });

    it("does not get an interface if a link is not provided", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link, networkLinkFactory()],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getLinkInterfaceById(machine, null)).toStrictEqual([null, null]);
    });
  });

  describe("isAlias", () => {
    it("is not an alias if a link is not provided", () => {
      const nic = machineInterfaceFactory();
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(isAlias(machine, null)).toBe(false);
    });

    it("is not an alias if it is the first link item", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link, networkLinkFactory()],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(isAlias(machine, link)).toBe(false);
    });

    it("is an alias if it is not the first link item", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [networkLinkFactory(), link],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(isAlias(machine, link)).toBe(true);
    });
  });

  describe("getInterfaceName", () => {
    it("gets the name of an interface", () => {
      const nic = machineInterfaceFactory({
        name: "br0",
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceName(machine, nic)).toBe("br0");
    });

    it("gets the name of an interface when providing a link", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [networkLinkFactory(), link],
        name: "br0",
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceName(machine, null, link)).toBe("br0:1");
    });
  });

  describe("getInterfaceType", () => {
    it("gets the type of an interface", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceType(machine, nic)).toBe(NetworkInterfaceTypes.VLAN);
    });

    it("gets the type of an interface when providing a link", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [networkLinkFactory(), link],
        type: NetworkInterfaceTypes.VLAN,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceType(machine, null, link)).toBe(
        NetworkInterfaceTypes.ALIAS
      );
    });
  });

  describe("hasInterfaceType", () => {
    it("can check for a single type", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(hasInterfaceType(NetworkInterfaceTypes.VLAN, machine, nic)).toBe(
        true
      );
    });

    it("can check for one of many types", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        hasInterfaceType(
          [NetworkInterfaceTypes.BOND, NetworkInterfaceTypes.VLAN],
          machine,
          nic
        )
      ).toBe(true);
    });

    it("can check for the type of a link", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [networkLinkFactory(), link],
        type: NetworkInterfaceTypes.VLAN,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        hasInterfaceType(NetworkInterfaceTypes.ALIAS, machine, null, link)
      ).toBe(true);
    });
  });

  describe("getLinkMode", () => {
    it("gets the mode of a link", () => {
      const link = networkLinkFactory({ mode: NetworkLinkMode.AUTO });
      expect(getLinkMode(link)).toBe(NetworkLinkMode.AUTO);
    });

    it("is link_up when there are no links", () => {
      expect(getLinkMode(null)).toBe(NetworkLinkMode.LINK_UP);
    });
  });

  describe("getBondOrBridgeParents", () => {
    it("gets parents for a bond", () => {
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
      expect(getBondOrBridgeParents(machine, nic)).toStrictEqual([
        interfaces[0],
        interfaces[2],
      ]);
    });

    it("gets parents for a bridge", () => {
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
      expect(getBondOrBridgeParents(machine, nic)).toStrictEqual([
        interfaces[0],
        interfaces[2],
      ]);
    });

    it("does not get parents for links", () => {
      const interfaces = [
        machineInterfaceFactory(),
        machineInterfaceFactory(),
        machineInterfaceFactory(),
      ];
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link],
        parents: [interfaces[0].id, interfaces[2].id],
        type: NetworkInterfaceTypes.VLAN,
      });
      interfaces.push(nic);
      const machine = machineDetailsFactory({ interfaces });
      expect(getBondOrBridgeParents(machine, null, link)).toStrictEqual([]);
    });

    it("does not get parents for other types", () => {
      const interfaces = [
        machineInterfaceFactory(),
        machineInterfaceFactory(),
        machineInterfaceFactory(),
      ];
      const nic = machineInterfaceFactory({
        parents: [interfaces[0].id, interfaces[2].id],
        type: NetworkInterfaceTypes.VLAN,
      });
      interfaces.push(nic);
      const machine = machineDetailsFactory({ interfaces });
      expect(getBondOrBridgeParents(machine, nic)).toStrictEqual([]);
    });
  });

  describe("getBondOrBridgeChild", () => {
    it("gets the child interface for a parent", () => {
      const nic = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.BOND,
      });
      const parent = machineInterfaceFactory({
        children: [nic.id],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, parent] });
      expect(getBondOrBridgeChild(machine, parent)).toStrictEqual(nic);
    });

    it("gets the child interface for a parent with multiple children", () => {
      const nic = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.BOND,
      });
      const vlan = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.VLAN,
      });
      const parent = machineInterfaceFactory({
        children: [vlan.id, nic.id],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({
        interfaces: [nic, parent, vlan],
      });
      expect(getBondOrBridgeChild(machine, parent)).toStrictEqual(nic);
    });

    it("gets the child interface via an alias", () => {
      const nic = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.BOND,
      });
      const link = networkLinkFactory();
      const parent = machineInterfaceFactory({
        links: [link],
        children: [nic.id],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, parent] });
      expect(getBondOrBridgeChild(machine, null, link)).toStrictEqual(nic);
    });
  });

  describe("isBondOrBridgeParent", () => {
    it("can be an interface parent", () => {
      const nic = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.BOND,
      });
      const parent = machineInterfaceFactory({
        children: [nic.id],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, parent] });
      expect(isBondOrBridgeParent(machine, parent)).toBe(true);
    });

    it("is not an interface parent when the child interface is not a bond or bridge", () => {
      const nic = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.ALIAS,
      });
      const vlan = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.VLAN,
      });
      const parent = machineInterfaceFactory({
        children: [nic.id, vlan.id],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({
        interfaces: [nic, parent, vlan],
      });
      expect(isBondOrBridgeParent(machine, parent)).toBe(false);
    });

    it("is not an interface parent providing an alias", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link],
        parents: [99],
        type: NetworkInterfaceTypes.ALIAS,
      });
      const parent = machineInterfaceFactory({
        children: [nic.id, 101],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, parent] });
      expect(isBondOrBridgeParent(machine, null, link)).toBe(false);
    });
  });

  describe("isBondOrBridgeChild", () => {
    it("can be an interface child", () => {
      const nic = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.BOND,
      });
      const parent = machineInterfaceFactory({
        children: [nic.id],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, parent] });
      expect(isBondOrBridgeChild(machine, nic)).toBe(true);
    });

    it("is not an interface child when there are no parents", () => {
      const nic = machineInterfaceFactory({
        parents: [],
        type: NetworkInterfaceTypes.BOND,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(isBondOrBridgeChild(machine, nic)).toBe(false);
    });

    it("is not an interface child if it is not a bond or bridge", () => {
      const nic = machineInterfaceFactory({
        parents: [99],
        type: NetworkInterfaceTypes.ALIAS,
      });
      const parent = machineInterfaceFactory({
        children: [nic.id, 101],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, parent] });
      expect(isBondOrBridgeChild(machine, nic)).toBe(false);
    });

    it("is not an interface child when providing an alias", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link],
        parents: [99],
        type: NetworkInterfaceTypes.ALIAS,
      });
      const parent = machineInterfaceFactory({
        children: [nic.id, 101],
        id: 99,
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, parent] });
      expect(isBondOrBridgeChild(machine, null, link)).toBe(false);
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

    it("returns an interface's numa node via an alias", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link],
        numa_node: 2,
        parents: [],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceNumaNodes(machine, null, link)).toEqual([2]);
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

  describe("getInterfaceTypeText", () => {
    it("returns the text for standard types", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceTypeText(machine, nic)).toBe("VLAN");
    });

    it("returns the text for an alias", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link],
        type: NetworkInterfaceTypes.VLAN,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceTypeText(machine, null, link)).toBe("VLAN");
    });

    it("returns correct text if bridge type is OVS", () => {
      const nic = machineInterfaceFactory({
        id: 100,
        children: [99],
      });
      const child = machineInterfaceFactory({
        id: 99,
        parents: [100],
        type: NetworkInterfaceTypes.BRIDGE,
        params: { bridge_type: BridgeType.OVS },
      });
      const machine = machineDetailsFactory({ interfaces: [nic, child] });
      expect(getInterfaceTypeText(machine, nic)).toBe("Open vSwitch");
    });

    it("returns correct text if physical interface has a child with bond type", () => {
      const child = machineInterfaceFactory({
        id: 99,
        parents: [100],
        type: NetworkInterfaceTypes.BOND,
      });
      const nic = machineInterfaceFactory({
        id: 100,
        children: [99],
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, child] });
      expect(getInterfaceTypeText(machine, nic)).toBe("Bonded physical");
    });

    it("returns correct text if physical interface has a child with bridge type", () => {
      const child = machineInterfaceFactory({
        id: 99,
        parents: [100],
        type: NetworkInterfaceTypes.BRIDGE,
      });
      const nic = machineInterfaceFactory({
        id: 100,
        children: [99],
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic, child] });
      expect(getInterfaceTypeText(machine, nic)).toBe("Bridged physical");
    });
  });

  describe("getRemoveTypeText", () => {
    it("returns the text for a physical interface", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getRemoveTypeText(machine, nic)).toBe("interface");
    });

    it("returns the text for a VLAN", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getRemoveTypeText(machine, nic)).toBe("VLAN");
    });

    it("returns the text for other interfaces", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.BRIDGE,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getRemoveTypeText(machine, nic)).toBe("bridge");
    });

    it("returns the text via an alias", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link],
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getRemoveTypeText(machine, null, link)).toBe("interface");
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

    it("checks parents for a boot interface", () => {
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

    it("is not a boot interface if there are no parents with is_boot", () => {
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

    it("checks if the nic is a boot interface via a link", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        is_boot: true,
        links: [link],
        type: NetworkInterfaceTypes.BRIDGE,
      });
      const machine = machineDetailsFactory();
      expect(isBootInterface(machine, nic, link)).toBe(true);
    });
  });

  describe("isInterfaceConnected", () => {
    it("checks if the interface itself is connected", () => {
      const nic = machineInterfaceFactory({
        link_connected: true,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(isInterfaceConnected(machine, nic)).toBe(true);
    });

    it("checks if the interface itself is not connected", () => {
      const nic = machineInterfaceFactory({
        link_connected: false,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(isInterfaceConnected(machine, nic)).toBe(false);
    });

    it("checks the conncted status via a link", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        link_connected: true,
        links: [link],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(isInterfaceConnected(machine, null, link)).toBe(true);
    });
  });

  describe("getLinkModeDisplay", () => {
    it("maps the link modes to display text", () => {
      expect(
        getLinkModeDisplay(networkLinkFactory({ mode: NetworkLinkMode.AUTO }))
      ).toBe("Auto assign");
      expect(
        getLinkModeDisplay(networkLinkFactory({ mode: NetworkLinkMode.DHCP }))
      ).toBe("DHCP");
      expect(
        getLinkModeDisplay(
          networkLinkFactory({ mode: NetworkLinkMode.LINK_UP })
        )
      ).toBe("Unconfigured");
      expect(getLinkModeDisplay(null)).toBe("Unconfigured");
      expect(
        getLinkModeDisplay(networkLinkFactory({ mode: NetworkLinkMode.STATIC }))
      ).toBe("Static assign");
    });
  });

  describe("getInterfaceDiscovered", () => {
    it("returns null if there is no discovered data", () => {
      const nic = machineInterfaceFactory({ discovered: null });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceDiscovered(machine, nic)).toBe(null);
    });

    it("gets the discovered data for the interface", () => {
      const discovered = networkDiscoveredIPFactory();
      const nic = machineInterfaceFactory({
        discovered: [discovered],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceDiscovered(machine, nic)).toStrictEqual(discovered);
    });

    it("checks the conncted status via a link", () => {
      const discovered = networkDiscoveredIPFactory();
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        discovered: [discovered],
        links: [link],
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceDiscovered(machine, null, link)).toStrictEqual(
        discovered
      );
    });
  });

  describe("getInterfaceFabric", () => {
    it("can get a fabric", () => {
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const nic = machineInterfaceFactory({
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(getInterfaceFabric(machine, [fabric], [vlan], nic)).toStrictEqual(
        fabric
      );
    });

    it("can get a fabric from a link", () => {
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [link],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceFabric(machine, [fabric], [vlan], null, link)
      ).toStrictEqual(fabric);
    });
  });

  describe("getInterfaceIPAddress", () => {
    it("can get a discovered ip address", () => {
      const discovered = networkDiscoveredIPFactory({ ip_address: "1.2.3.4" });
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const nic = machineInterfaceFactory({
        discovered: [discovered],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceIPAddress(machine, [fabric], [vlan], nic)
      ).toStrictEqual("1.2.3.4");
    });

    it("can get an ip address from a link", () => {
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const link = networkLinkFactory({ ip_address: "1.2.3.4" });
      const nic = machineInterfaceFactory({
        links: [link],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceIPAddress(machine, [fabric], [vlan], null, link)
      ).toStrictEqual("1.2.3.4");
    });
  });

  describe("getInterfaceIPAddressOrMode", () => {
    it("can get a discovered ip address", () => {
      const discovered = networkDiscoveredIPFactory({ ip_address: "1.2.3.4" });
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const nic = machineInterfaceFactory({
        discovered: [discovered],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceIPAddressOrMode(machine, [fabric], [vlan], nic)
      ).toStrictEqual("1.2.3.4");
    });

    it("can get an ip address from a link", () => {
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const link = networkLinkFactory({ ip_address: "1.2.3.4" });
      const nic = machineInterfaceFactory({
        links: [link],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceIPAddressOrMode(machine, [fabric], [vlan], null, link)
      ).toStrictEqual("1.2.3.4");
    });

    it("can get the link mode", () => {
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const link = networkLinkFactory({
        ip_address: "",
        mode: NetworkLinkMode.AUTO,
      });
      const nic = machineInterfaceFactory({
        links: [link],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceIPAddressOrMode(machine, [fabric], [vlan], null, link)
      ).toStrictEqual("Auto assign");
    });
  });

  describe("getInterfaceSubnet", () => {
    it("can get a discovered subnet", () => {
      const subnet = subnetFactory();
      const discovered = networkDiscoveredIPFactory({ subnet_id: subnet.id });
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const nic = machineInterfaceFactory({
        discovered: [discovered],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceSubnet(machine, [subnet], [fabric], [vlan], true, nic)
      ).toStrictEqual(subnet);
    });

    it("does not get the discovered subnet when networking is enabled", () => {
      const subnet = subnetFactory();
      const discovered = networkDiscoveredIPFactory({ subnet_id: subnet.id });
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const nic = machineInterfaceFactory({
        discovered: [discovered],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceSubnet(machine, [subnet], [fabric], [vlan], false, nic)
      ).toBe(null);
    });

    it("can get a subnet from a link", () => {
      const subnet = subnetFactory();
      const fabric = fabricFactory();
      const vlan = vlanFactory({ fabric: fabric.id });
      const link = networkLinkFactory({ subnet_id: subnet.id });
      const nic = machineInterfaceFactory({
        links: [link],
        vlan_id: vlan.id,
      });
      const machine = machineDetailsFactory({ interfaces: [nic] });
      expect(
        getInterfaceSubnet(
          machine,
          [subnet],
          [fabric],
          [vlan],
          true,
          null,
          link
        )
      ).toStrictEqual(subnet);
    });
  });

  describe("getNextNicName", () => {
    describe("physical", () => {
      it("can get the next physical nic name", () => {
        const machine = machineDetailsFactory({
          interfaces: [machineInterfaceFactory({ name: "eth0" })],
        });
        expect(
          getNextNicName(machine, NetworkInterfaceTypes.PHYSICAL)
        ).toStrictEqual("eth1");
      });

      it("can get the next physical nic name when there are no existing nics", () => {
        const machine = machineDetailsFactory({ interfaces: [] });
        expect(
          getNextNicName(machine, NetworkInterfaceTypes.PHYSICAL)
        ).toStrictEqual("eth0");
      });

      it("can get the next physical nic name when the names are out of order", () => {
        const machine = machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({ name: "eth1" }),
            machineInterfaceFactory({ name: "eth12" }),
            machineInterfaceFactory({ name: "eth5" }),
          ],
        });
        expect(
          getNextNicName(machine, NetworkInterfaceTypes.PHYSICAL)
        ).toStrictEqual("eth13");
      });

      it("can get the next physical nic name when there are non sequential names", () => {
        const machine = machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({ name: "eth1" }),
            machineInterfaceFactory({ name: "ethernetsix" }),
          ],
        });
        expect(
          getNextNicName(machine, NetworkInterfaceTypes.PHYSICAL)
        ).toStrictEqual("eth2");
      });

      it("can get the next physical nic name when there are partial names", () => {
        const machine = machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({ name: "eth1" }),
            machineInterfaceFactory({ name: "eth" }),
          ],
        });
        expect(
          getNextNicName(machine, NetworkInterfaceTypes.PHYSICAL)
        ).toStrictEqual("eth2");
      });

      it("can get the next physical nic name when there are partial similar", () => {
        const machine = machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({ name: "eth1" }),
            machineInterfaceFactory({ name: "eth3eth3" }),
          ],
        });
        expect(
          getNextNicName(machine, NetworkInterfaceTypes.PHYSICAL)
        ).toStrictEqual("eth2");
      });
    });

    describe("alias", () => {
      it("can get the next alias name", () => {
        const nic = machineInterfaceFactory({
          links: [networkLinkFactory()],
          name: "eth0",
        });
        const machine = machineDetailsFactory({
          interfaces: [nic],
        });
        expect(
          getNextNicName(machine, NetworkInterfaceTypes.ALIAS, nic)
        ).toStrictEqual("eth0:1");
      });
    });

    describe("VLAN", () => {
      it("can get the next vlan name", () => {
        const nic = machineInterfaceFactory({
          name: "eth0",
        });
        const machine = machineDetailsFactory({
          interfaces: [nic],
        });
        expect(
          getNextNicName(machine, NetworkInterfaceTypes.VLAN, nic, 5)
        ).toStrictEqual("eth0.5");
      });
    });
  });

  describe("canAddAlias", () => {
    it("can not add an alias if the nic is an alias", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [networkLinkFactory(), link],
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({
        interfaces: [nic],
      });
      expect(canAddAlias(machine, nic, link)).toBe(false);
    });

    it("can not add an alias if there are no links", () => {
      const nic = machineInterfaceFactory({
        links: [],
        type: NetworkInterfaceTypes.ALIAS,
      });
      const machine = machineDetailsFactory({
        interfaces: [nic],
      });
      expect(canAddAlias(machine, nic)).toBe(false);
    });

    it("can not add an alias if the first link is LINK_UP", () => {
      const nic = machineInterfaceFactory({
        links: [networkLinkFactory({ mode: NetworkLinkMode.LINK_UP })],
        type: NetworkInterfaceTypes.ALIAS,
      });
      const machine = machineDetailsFactory({
        interfaces: [nic],
      });
      expect(canAddAlias(machine, nic)).toBe(false);
    });

    it("can add an alias", () => {
      const nic = machineInterfaceFactory({
        links: [networkLinkFactory({ mode: NetworkLinkMode.AUTO })],
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const machine = machineDetailsFactory({
        interfaces: [nic],
      });
      expect(canAddAlias(machine, nic)).toBe(true);
    });
  });

  describe("getLinkFromNic", () => {
    it("can retrieve a link from a nic", () => {
      const link = networkLinkFactory();
      const nic = machineInterfaceFactory({
        links: [networkLinkFactory(), link],
      });
      expect(getLinkFromNic(nic, link.id)).toStrictEqual(link);
    });

    it("handles no links found", () => {
      const nic = machineInterfaceFactory({
        links: [],
      });
      expect(getLinkFromNic(nic, 5)).toBe(null);
    });
  });
});
