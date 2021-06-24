export enum BridgeType {
  STANDARD = "standard",
  OVS = "ovs",
}

export enum NetworkInterfaceTypes {
  ALIAS = "alias",
  BOND = "bond",
  BRIDGE = "bridge",
  PHYSICAL = "physical",
  VLAN = "vlan",
}

export enum NetworkLinkMode {
  AUTO = "auto",
  DHCP = "dhcp",
  LINK_UP = "link_up",
  STATIC = "static",
}
