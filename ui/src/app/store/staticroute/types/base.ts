import type { APIError } from "app/base/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type StaticRoute = Model & {
  created: string;
  destination: Subnet[SubnetMeta.PK];
  gateway_ip: string;
  metric: number;
  source: Subnet[SubnetMeta.PK];
  updated: string;
};

export type StaticRouteState = GenericState<StaticRoute, APIError>;
