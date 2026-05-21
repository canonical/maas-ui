import type { Controller, ControllerMeta } from "@/app/store/controller/types";
import type { Fabric } from "@/app/store/fabric/types";
import type { Subnet } from "@/app/store/subnet/types";
import type { VLAN } from "@/app/store/vlan/types";

export type ControllerTableData = {
  id: string;
  fabric_id?: Fabric["id"];
  vlan_id: VLAN["id"];
  dhcp: string;
  subnet?: Subnet[];
  primary_rack?: Controller[ControllerMeta.PK] | null;
  secondary_rack?: Controller[ControllerMeta.PK] | null;
  sortKey?: string;
};
