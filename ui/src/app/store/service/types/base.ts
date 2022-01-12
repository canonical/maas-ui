import type { ServiceStatus } from "./enum";

import type { APIError } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type Service = Model & {
  name: string;
  status: ServiceStatus;
  status_info: string;
};

export type ServiceState = GenericState<Service, APIError>;
