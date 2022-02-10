export enum IPAddressType {
  AUTO = 0,
  STICKY = 1,
  USER_RESERVED = 4,
  DHCP = 5,
  DISCOVERED = 6,
}

export enum IPAddressTypeLabel {
  AUTO = "Automatic",
  STICKY = "Sticky",
  USER_RESERVED = "User reserved",
  DHCP = "DHCP",
  DISCOVERED = "Discovered",
}

export enum SubnetMeta {
  MODEL = "subnet",
  PK = "id",
}
