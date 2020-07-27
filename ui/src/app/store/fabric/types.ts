import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type Fabric = Model & {
  class_type: string | null;
  created: string;
  default_vlan_id: number;
  description: string;
  name: string;
  updated: string;
  vlan_ids: number[];
};

export type FabricState = {
  errors: TSFixMe;
  items: Fabric[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
