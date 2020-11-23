import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

import type { TSFixMe } from "app/base/types";

export type Zone = Model & {
  controllers_count: number;
  created: string;
  description: string;
  devices_count: number;
  machines_count: number;
  name: string;
  updated: string;
};

export type ZoneState = GenericState<Zone, TSFixMe>;
