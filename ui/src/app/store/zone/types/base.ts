import type { ValueOf } from "@canonical/react-components";

import type { ZONE_ACTIONS, ZONE_PK } from "../constants";

import type { APIError } from "app/base/types";
import type { Model } from "app/store/types/model";

export type Zone = Model & {
  controllers_count: number;
  created: string;
  description: string;
  devices_count: number;
  machines_count: number;
  name: string;
  updated: string;
};

export type ZonePK = Zone[typeof ZONE_PK];

export type ZoneProcess = {
  processing: ZonePK[];
  successful: ZonePK[];
};

export type ZoneProcesses = {
  [ZONE_ACTIONS.delete]: ZoneProcess;
  [ZONE_ACTIONS.update]: ZoneProcess;
};

export type ZoneAPIMeta = {
  formId: string | null;
  modelPk: ZonePK | null;
};

export type ZoneAPISuccess<R> = {
  result: R;
};

export type ZoneAPIError = ZoneAPIMeta & {
  error: APIError;
};

export type ZoneStateError = ZoneAPIError & {
  action: ValueOf<typeof ZONE_ACTIONS>;
};

export type ZoneState = {
  errors: ZoneStateError[];
  items: Zone[];
  loaded: boolean;
  loading: boolean;
  processes: ZoneProcesses;
  saved: boolean;
  saving: boolean;
};
