import type { APIError } from "app/base/types";
import type { TimestampedModel } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type Tag = TimestampedModel & {
  comment: string;
  controller_count: number;
  definition: string;
  device_count: number;
  kernel_opts: string | null;
  machine_count: number;
  name: string;
};

export type TagState = GenericState<Tag, APIError>;
