export enum SubnetsColumns {
  FABRIC = "fabric",
  VLAN = "vlan",
  DHCP = "dhcp",
  SUBNET = "subnet",
  IPS = "ips",
  SPACE = "space",
}

export const fabricTableColumns = [
  "vlan",
  "dhcp",
  "subnet",
  "ips",
  "space",
] as const;

export const spaceTableColumns = [
  "vlan",
  "dhcp",
  "fabric",
  "subnet",
  "ips",
] as const;

export const subnetColumnLabels = {
  [SubnetsColumns.FABRIC]: "Fabric",
  [SubnetsColumns.VLAN]: "VLAN",
  [SubnetsColumns.DHCP]: "DHCP",
  [SubnetsColumns.SUBNET]: "Subnet",
  [SubnetsColumns.IPS]: "Available IPs",
  [SubnetsColumns.SPACE]: "Space",
} as const;

export const SUBNETS_TABLE_ITEMS_PER_PAGE = 25;
