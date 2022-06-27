import type { ValueOf } from "@canonical/react-components";

import type { ZONE_ACTIONS } from "../constants";

import type { ZoneMeta } from "./enum";

import type {
  ActionStatuses,
  ModelAction,
  PayloadActionWithIdentifier,
  StateError,
} from "app/base/types";
import type { TimestampedModel } from "app/store/types/model";

export type ZonePK = Zone[ZoneMeta.PK];

export type ZoneActionNames = ValueOf<typeof ZONE_ACTIONS>;

export type Zone = TimestampedModel & {
  controllers_count: number;
  description: string;
  devices_count: number;
  machines_count: number;
  name: string;
};

export type ZoneGenericActions = {
  [ZONE_ACTIONS.create]: ActionStatuses;
  [ZONE_ACTIONS.fetch]: ActionStatuses;
};

export type ZoneModelAction = ModelAction<ZonePK>;

export type ZoneModelActions = {
  [ZONE_ACTIONS.delete]: ZoneModelAction;
  [ZONE_ACTIONS.update]: ZoneModelAction;
};

export type ZonePayloadActionWithIdentifier<P = null> =
  PayloadActionWithIdentifier<ZonePK, P>;

export type ZoneStateError = StateError<ZoneActionNames, ZonePK>;

export type ZoneState = {
  errors: ZoneStateError[];
  genericActions: ZoneGenericActions;
  items: Zone[];
  modelActions: ZoneModelActions;
};
