import type {
  Machine,
  NetworkInterface,
  NetworkLink,
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
 * Get the link's interface and position.
 * @param machine - The nic's machine.
 * @param link - A link to an interface.
 * @return The link's interface and position.
 */
export const getLinkInterface = (
  machine: Machine,
  link: NetworkLink | null
): [NetworkInterface | null, number | null] => {
  if (!link || !("interfaces" in machine)) {
    return [null, null];
  }
  for (let i = 0; i < machine.interfaces.length; i++) {
    const links = machine.interfaces[i].links;
    for (let j = 0; j < links.length; j++) {
      if (links[j].id === link.id) {
        return [machine.interfaces[i], j];
      }
    }
  }
  return [null, null];
};

/**
 * Whether an interface is an alias.
 * @param machine - The nic's machine.
 * @param link - A link to an interface.
 * @return Whether this is an alias.
 */
export const isAlias = (
  machine: Machine,
  link: NetworkLink | null
): boolean => {
  const [, linkIndex] = getLinkInterface(machine, link);
  // The first link provides supplementary data for the non-alias interface.
  return !!link && typeof linkIndex === "number" && linkIndex > 0;
};

/**
 * Get the name of an interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return The interface's name.
 */
export const getInterfaceName = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): string => {
  let linkIndex: number | null = null;
  if (link) {
    [nic, linkIndex] = getLinkInterface(machine, link);
  }
  if (!nic) {
    return "";
  }
  return link && isAlias(machine, link) && linkIndex
    ? `${nic.name}:${linkIndex}`
    : nic.name;
};

/**
 * Get the type of an interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return The interface type.
 */
export const getInterfaceType = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): NetworkInterfaceTypes | null => {
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  return link && isAlias(machine, link)
    ? NetworkInterfaceTypes.ALIAS
    : nic?.type || null;
};

/**
 * Check if an interface has a certain type or types.
 * @param interfaceType - A single or array of interface types.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return Whether the interface's type matches those supplied.
 */
export const hasInterfaceType = (
  interfaceType: NetworkInterfaceTypes | NetworkInterfaceTypes[],
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): boolean => {
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  const nicOrLinkType = getInterfaceType(machine, nic, link);
  return (
    !!nicOrLinkType &&
    (Array.isArray(interfaceType) ? interfaceType : [interfaceType]).includes(
      nicOrLinkType
    )
  );
};

/**
 * Get the mode for a link.
 * @param link - A link to an interface.
 * @return The interface mode.
 */
export const getLinkMode = (link: NetworkLink | null): NetworkLink["mode"] => {
  // If the interface is either disabled or has no links it means the interface
  // is in LINK_UP mode.
  return link?.mode || NetworkLinkMode.LINK_UP;
};

/**
 * Get the parents for a bond or bridge interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return The parents for a bond or bridge interface.
 */
export const getBondOrBridgeParents = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): NetworkInterface[] => {
  if (
    !nic ||
    !machine ||
    !("interfaces" in machine) ||
    !hasInterfaceType(
      [NetworkInterfaceTypes.BOND, NetworkInterfaceTypes.BRIDGE],
      machine,
      nic,
      link
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
  nic: NetworkInterface | null
): NetworkInterface | null => {
  if (!nic || !("interfaces" in machine)) {
    return null;
  }
  return machine.interfaces.find(({ id }) => id === nic.children[0]) || null;
};

/**
 * Get the interface that joins parents of a bond or bridge.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return The interface that joins bond or bridge interfaces.
 */
export const getBondOrBridgeChild = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): NetworkInterface | null => {
  if (!isBondOrBridgeParent(machine, nic, link)) {
    return null;
  }
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  return findBondOrBridgeChild(machine, nic);
};

/**
 * Check if an interface is a parent of a bond or bridge.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return Whether an interface is a parent of a bond or bridge.
 */
export const isBondOrBridgeParent = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): boolean => {
  if (link && isAlias(machine, link)) {
    // Links can't be bond or bridge parents.
    return false;
  }
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  // An interface with a bond or bridge child can only have
  // one child.
  if (!nic || nic.children.length !== 1) {
    return false;
  }
  const child = findBondOrBridgeChild(machine, nic);
  if (child) {
    return hasInterfaceType(
      [NetworkInterfaceTypes.BOND, NetworkInterfaceTypes.BRIDGE],
      machine,
      child
    );
  }
  return false;
};

/**
 * Get the numa nodes for an interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return The numa nodes for the interface.
 */
export const getInterfaceNumaNodes = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): NetworkInterface["numa_node"][] | null => {
  if (!machine || !("interfaces" in machine)) {
    return null;
  }
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  if (!nic) {
    return null;
  }
  if (!nic.parents?.length) {
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
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return The text for the interface type.
 */
export const getInterfaceTypeText = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): string | null => {
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  const child = getBondOrBridgeChild(machine, nic, link);
  let interfaceType: NetworkInterfaceTypes | BridgeType.OVS | null = null;
  if (child) {
    interfaceType =
      child.params?.bridge_type === BridgeType.OVS
        ? child.params.bridge_type
        : getInterfaceType(machine, child);
  } else {
    interfaceType = getInterfaceType(machine, nic, link);
  }
  const text = interfaceType ? INTERFACE_TYPE_DISPLAY[interfaceType] : null;
  if (
    text &&
    hasInterfaceType(NetworkInterfaceTypes.PHYSICAL, machine, nic, link)
  ) {
    switch (interfaceType) {
      case NetworkInterfaceTypes.BOND:
        return "Bonded physical";
      case NetworkInterfaceTypes.BRIDGE:
        return "Bridged physical";
    }
  }
  return text || interfaceType;
};

/**
 * Check the interface is the boot interface or has a parent
 * that is a boot interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return Whether this is a boot interface.
 */
export const isBootInterface = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): boolean => {
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  if (!nic || !machine) {
    return false;
  }
  if (
    nic.is_boot &&
    !hasInterfaceType(NetworkInterfaceTypes.ALIAS, machine, nic, link)
  ) {
    return true;
  }
  const parents = getBondOrBridgeParents(machine, nic, link);
  return parents.some(({ is_boot }) => is_boot);
};

/**
 * Check if an interface is connected.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @param link - A link to an interface.
 * @return Whether an interface is connected.
 */
export const isInterfaceConnected = (
  machine: Machine,
  nic: NetworkInterface | null,
  link?: NetworkLink | null
): boolean => {
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
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
 * @param link - A link to an interface.
 * @return The display text for a link mode.
 */
export const getLinkModeDisplay = (
  link?: NetworkLink | null
): string | null => {
  const mode = link ? getLinkMode(link) : null;
  return mode ? LINK_MODE_DISPLAY[mode] || mode : "Unconfigured";
};
