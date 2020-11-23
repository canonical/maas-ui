import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

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

export type FabricState = GenericState<Fabric, TSFixMe>;
