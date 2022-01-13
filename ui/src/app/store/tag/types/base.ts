import type { APIError } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type Tag = Model & {
  comment: string;
  controller_count: number;
  created: string;
  definition: string;
  device_count: number;
  kernel_opts: string | null;
  machine_count: number;
  name: string;
  updated: string;
};

export type TagState = GenericState<Tag, APIError>;
