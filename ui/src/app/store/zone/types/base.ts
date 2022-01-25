import type { APIError } from "app/base/types";
import type { TimestampedModel } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type Zone = TimestampedModel & {
  controllers_count: number;
  description: string;
  devices_count: number;
  machines_count: number;
  name: string;
};

export type ZoneState = GenericState<Zone, APIError>;
