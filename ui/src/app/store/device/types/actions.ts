import type { Device } from "./base";
import type { DeviceMeta } from "./enum";

import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import type { Zone, ZoneMeta } from "app/store/zone/types";

export type CreateParams = {
  domain?: Device["domain"];
  hostname?: Device["hostname"];
  interfaces: {
    mac: string;
    ip_assignment: Device["ip_assignment"];
    ip_address: Device["ip_address"];
    subnet: Subnet[SubnetMeta.PK];
  }[];
  mac_addresses?: string[];
  parent?: Controller[ControllerMeta.PK] | Machine[MachineMeta.PK];
  swap_size?: string;
  zone?: Zone[ZoneMeta.PK];
};

export type UpdateParams = CreateParams & {
  [DeviceMeta.PK]: Device[DeviceMeta.PK];
  tags?: string;
};
