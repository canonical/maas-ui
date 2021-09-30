import type { Device, DeviceDetails } from "./base";
import type { DeviceMeta } from "./enum";

import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { Domain } from "app/store/domain/types";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import type { NetworkInterface } from "app/store/types/node";
import type { ZonePK } from "app/store/zone/types";

export type CreateParams = {
  mac_addresses?: string[];
  domain?: { name: Domain["name"] };
  description?: DeviceDetails["description"];
  extra_macs?: string[];
  hostname?: Device["hostname"];
  interfaces: {
    mac: string;
    ip_assignment: Device["ip_assignment"];
    ip_address: Device["ip_address"];
    subnet: Subnet[SubnetMeta.PK];
  }[];
  parent?: Controller[ControllerMeta.PK] | Machine[MachineMeta.PK];
  primary_mac?: string;
  swap_size?: string;
  zone?: { name: ZonePK };
};

export type CreateInterfaceParams = {
  [DeviceMeta.PK]: Device[DeviceMeta.PK];
  enabled?: NetworkInterface["enabled"];
  ip_address?: Device["ip_address"];
  ip_assignment: Device["ip_assignment"];
  mac_address: NetworkInterface["mac_address"];
  name?: NetworkInterface["name"];
  numa_node?: NetworkInterface["numa_node"];
  subnet?: Subnet[SubnetMeta.PK];
  vlan?: NetworkInterface["vlan_id"];
  tags?: NetworkInterface["tags"];
  link_connected?: NetworkInterface["link_connected"];
  interface_speed?: NetworkInterface["interface_speed"];
  link_speed?: NetworkInterface["link_speed"];
};

export type UpdateParams = CreateParams & {
  [DeviceMeta.PK]: Device[DeviceMeta.PK];
  tags?: string;
};
