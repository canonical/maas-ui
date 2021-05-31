import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export enum ServiceMeta {
  MODEL = "service",
  PK = "id",
}

export type Service = Model & {
  name: string;
  status: string;
  status_info: string;
};

export type ServiceState = GenericState<Service, TSFixMe>;
