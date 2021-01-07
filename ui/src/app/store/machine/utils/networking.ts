import type {
  Machine,
  NetworkInterface,
  NetworkLinkInterface,
} from "app/store/machine/types";
import {
  BridgeType,
  NetworkInterfaceTypes,
  NetworkLinkMode,
} from "app/store/machine/types";

const INTERFACE_TYPE_DISPLAY = {
  [NetworkInterfaceTypes.PHYSICAL]: "Physical",
  [NetworkInterfaceTypes.BOND]: "Bond",
  [NetworkInterfaceTypes.BRIDGE]: "Bridge",
  [NetworkInterfaceTypes.VLAN]: "VLAN",
  [NetworkInterfaceTypes.ALIAS]: "Alias",
  [BridgeType.OVS]: "Open vSwitch",
};

/**
 * Get the parents for a bond or bridge interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return The parents for a bond or bridge interface.
 */
export const getBondOrBridgeParents = (
  machine: Machine,
  nic: NetworkInterface | NetworkLinkInterface
): NetworkInterface[] => {
  if (
    !nic ||
    !machine ||
    !("interfaces" in machine) ||
    ![NetworkInterfaceTypes.BOND, NetworkInterfaceTypes.BRIDGE].includes(
      nic.type
    )
  ) {
    return [];
  }
  return nic.parents.reduce<NetworkInterface[]>((parents, parent) => {
    const match = machine.interfaces.find(({ id }) => id && id === parent);
    if (match) {
      parents.push(match);
    }
    return parents;
  }, []);
};

/**
 * Get the interface that joins parents of a bond or bridge.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return The interface that joins bond or bridge interfaces.
 */
const findBondOrBridgeChild = (
  machine: Machine,
  nic: NetworkInterface | NetworkLinkInterface
): NetworkInterface | null => {
  if (!("interfaces" in machine)) {
    return null;
  }
  return machine.interfaces.find(({ id }) => id === nic.children[0]) || null;
};

/**
 * Get the interface that joins parents of a bond or bridge.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return The interface that joins bond or bridge interfaces.
 */
export const getBondOrBridgeChild = (
  machine: Machine,
  nic: NetworkInterface | NetworkLinkInterface
): NetworkInterface | null => {
  if (!isBondOrBridgeParent(machine, nic)) {
    return null;
  }
  return findBondOrBridgeChild(machine, nic);
};

/**
 * Check if an interface is a parent of a bond or bridge.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return Whether an interface is a parent of a bond or bridge.
 */
export const isBondOrBridgeParent = (
  machine: Machine,
  nic: NetworkInterface | NetworkLinkInterface
): boolean => {
  // An interface with a bond or bridge child can only have
  // one child.
  if (!nic || nic.children.length !== 1) {
    return false;
  }
  const child = findBondOrBridgeChild(machine, nic);
  if (child) {
    return [NetworkInterfaceTypes.BOND, NetworkInterfaceTypes.BRIDGE].includes(
      child.type
    );
  }
  return false;
};

/**
 * Get the numa nodes for an interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return The numa nodes for the interface.
 */
export const getInterfaceNumaNodes = (
  machine: Machine,
  nic: NetworkInterface | NetworkLinkInterface
): NetworkInterface["numa_node"][] => {
  if (!nic || !machine || !("interfaces" in machine) || !nic.parents?.length) {
    return [nic.numa_node];
  }
  const allNumas = nic.parents.reduce(
    (parents, parent) => {
      const parentInterface = machine.interfaces.find(
        ({ id }) => id && id === parent
      );
      if (parentInterface && !parents.includes(parentInterface.numa_node)) {
        parents.push(parentInterface.numa_node);
      }
      return parents;
    },
    nic.numa_node ? [nic.numa_node] : []
  );
  return allNumas.sort((a, b) => a - b);
};

/**
 * Get the text for the type of the interface.
 * @param nic - A network interface.
 * @param parent - A bond or bridge parent.
 * @return The text for the interface type.
 */
export const getInterfaceTypeText = (
  nic: NetworkInterface | NetworkLinkInterface,
  parent?: NetworkInterface | NetworkLinkInterface
): string | null => {
  if (!nic) {
    return null;
  }
  const type =
    nic.params?.bridge_type === BridgeType.OVS
      ? nic.params.bridge_type
      : nic.type;
  const text = INTERFACE_TYPE_DISPLAY[type];
  if (text && parent?.type === NetworkInterfaceTypes.PHYSICAL) {
    switch (type) {
      case NetworkInterfaceTypes.BOND:
        return "Bonded physical";
      case NetworkInterfaceTypes.BRIDGE:
        return "Bridged physical";
    }
  }
  return text || type;
};

/**
 * Check the interface is the boot interface or has a parent
 * that is a boot interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return Whether this is a boot interface.
 */
export const isBootInterface = (
  machine: Machine,
  nic: NetworkInterface | NetworkLinkInterface
): boolean => {
  if (!nic || !machine) {
    return false;
  }
  if (nic.is_boot && nic.type !== NetworkInterfaceTypes.ALIAS) {
    return true;
  }
  const parents = getBondOrBridgeParents(machine, nic);
  return parents.some(({ is_boot }) => is_boot);
};

/**
 * Check if an interface is connected.
 * @param nic - A network interface.
 * @return Whether an interface is connected.
 */
export const isInterfaceConnected = (
  nic: NetworkInterface | NetworkLinkInterface
): boolean => {
  if (!nic) {
    return false;
  }
  return nic.link_connected;
};

const LINK_MODE_DISPLAY = {
  [NetworkLinkMode.AUTO]: "Auto assign",
  [NetworkLinkMode.DHCP]: "DHCP",
  [NetworkLinkMode.LINK_UP]: "Unconfigured",
  [NetworkLinkMode.STATIC]: "Static assign",
};

/**
 * Get the text for the link mode of the interface.
 * @param mode - A network link mode.
 * @return The display text for a link mode.
 */
export const getLinkModeDisplay = (mode: NetworkLinkMode): string | null =>
  LINK_MODE_DISPLAY[mode] || mode;
