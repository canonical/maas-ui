import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type Service = Model & {
  name: string;
  status: string;
  status_info: string;
};

export type ServiceState = {
  errors: TSFixMe;
  items: Service[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
