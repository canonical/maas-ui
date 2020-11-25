import type { TSFixMe } from "app/base/types";
import type { BaseNode } from "app/store/types/node";
import type { GenericState } from "app/store/types/state";

export type Controller = BaseNode & {
  last_image_sync: string;
  node_type: number; // TODO: it seems odd that this is only exposed for controller
  service_ids: number[];
  version_long: string;
  version_short: string;
  version: string;
};

export type ControllerState = GenericState<Controller, TSFixMe>;
