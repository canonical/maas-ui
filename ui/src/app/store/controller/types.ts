import type { BaseNode } from "app/store/node/types";
import type { TSFixMe } from "app/base/types";

export type Controller = BaseNode & {
  last_image_sync: string;
  node_type: number; // TODO: it seems odd that this is only exposed for controller
  service_ids: number[];
  version_long: string;
  version_short: string;
  version: string;
};

export type ControllerState = {
  errors: TSFixMe;
  items: Controller[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
