import type { ValueOf } from "@canonical/react-components";

import type { APIError } from "app/base/types";
import type { TimestampedModel } from "app/store/types/model";
import type {
  ACTION_STATUS,
  ZONE_ACTIONS,
  ZONE_PK,
} from "app/store/zone/constants";

/* The following types should be made generic, usable across models. */
export type ActionStatuses = ValueOf<typeof ACTION_STATUS>;

export type GenericAction = {
  [ACTION_STATUS.failed]: boolean;
  [ACTION_STATUS.processing]: boolean;
  [ACTION_STATUS.successful]: boolean;
};

export type ModelAction<PK> = {
  [ACTION_STATUS.failed]: PK[];
  [ACTION_STATUS.processing]: PK[];
  [ACTION_STATUS.successful]: PK[];
};

export type StateError<A extends string, PK> = {
  action: A;
  error: APIError;
  modelPK: PK | null;
};
/***************************/

export type ZonePK = Zone[typeof ZONE_PK];

export type ZoneActionNames = ValueOf<typeof ZONE_ACTIONS>;

export type Zone = TimestampedModel & {
  controllers_count: number;
  description: string;
  devices_count: number;
  machines_count: number;
  name: string;
};

export type ZoneGenericActions = {
  [ZONE_ACTIONS.create]: GenericAction;
  [ZONE_ACTIONS.fetch]: GenericAction;
};

export type ZoneModelActions = {
  [ZONE_ACTIONS.delete]: ModelAction<ZonePK>;
  [ZONE_ACTIONS.update]: ModelAction<ZonePK>;
};

export type ZoneStateError = StateError<ZoneActionNames, ZonePK>;

export type ZoneState = {
  errors: ZoneStateError[];
  genericActions: ZoneGenericActions;
  items: Zone[];
  modelActions: ZoneModelActions;
};
