import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

import type { TSFixMe } from "app/base/types";

export type Service = Model & {
  name: string;
  status: string;
  status_info: string;
};

export type ServiceState = GenericState<Service, TSFixMe>;
