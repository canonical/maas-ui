export enum SubnetsColumns {
  FABRIC = "fabric",
  VLAN = "vlan",
  DHCP = "dhcp",
  SUBNET = "subnet",
  IPS = "ips",
  SPACE = "space",
}

export const subnetColumnLabels: Record<SubnetsColumns, string> = {
  [SubnetsColumns.FABRIC]: "Fabric",
  [SubnetsColumns.VLAN]: "VLAN",
  [SubnetsColumns.DHCP]: "DHCP",
  [SubnetsColumns.SUBNET]: "Subnet",
  [SubnetsColumns.IPS]: "Available IPs",
  [SubnetsColumns.SPACE]: "Space",
};
