import type { TSFixMe } from "app/base/types";
import type { Fabric, FabricMeta } from "app/store/fabric/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export enum VLANMeta {
  MODEL = "vlan",
  PK = "id",
}

export enum VlanVid {
  UNTAGGED = 0,
}

export type VLAN = Model & {
  created: string;
  description: string;
  dhcp_on: boolean;
  external_dhcp: string | null;
  fabric: Fabric[FabricMeta.PK];
  mtu: number;
  name: string;
  primary_rack: string | null;
  rack_sids: string[];
  relay_vlan: number | null;
  secondary_rack: string | null;
  space: number;
  updated: string;
  vid: VlanVid.UNTAGGED | number;
};

export type VLANState = GenericState<VLAN, TSFixMe>;
