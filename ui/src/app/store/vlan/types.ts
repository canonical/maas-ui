import type { GenericState } from "app/store/types/state";
import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type VLAN = Model & {
  created: string;
  description: string;
  dhcp_on: boolean;
  external_dhcp: string | null;
  fabric: number;
  mtu: number;
  name: string;
  primary_rack: string | null;
  rack_sids: string[];
  relay_vlan: number | null;
  secondary_rack: string | null;
  space: number;
  updated: string;
  vid: number;
};

export type VLANState = GenericState<VLAN, TSFixMe>;
