import type { ValueOf } from "@canonical/react-components";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { APIError } from "app/base/types";
import type { TimestampedModel } from "app/store/types/model";
import type {
  ACTION_STATUS,
  ZONE_ACTIONS,
  ZONE_PK,
} from "app/store/zone/constants";

/* The following types should be made generic, usable across models. */
export type ActionStatuses = ValueOf<typeof ACTION_STATUS>;

export type ModelAction<PK> = {
  [ACTION_STATUS.failed]: PK[];
  [ACTION_STATUS.processing]: PK[];
  [ACTION_STATUS.successful]: PK[];
};

export type PayloadActionWithMeta<M, P = null> = PayloadAction<
  P,
  string,
  { modelPK: M }
>;

export type StateError<A extends string, PK> = {
  action: A;
  error: APIError;
  modelPK: PK | null;
};
/***************************/

export type ZonePK = Zone[typeof ZONE_PK];

export type ZoneActionNames = ValueOf<typeof ZONE_ACTIONS>;

export type ZonePayloadActionWithMeta<P = null> = PayloadActionWithMeta<
  ZonePK,
  P
>;

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

export type ZoneStateError = StateError<ZoneActionNames, ZonePK>;

export type ZoneState = {
  errors: ZoneStateError[];
  genericActions: ZoneGenericActions;
  items: Zone[];
  modelActions: ZoneModelActions;
};
