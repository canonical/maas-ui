import { COMMON_ACTIONS, COMMON_WEBSOCKET_METHODS } from "app/base/constants";

export const ZONE_ACTIONS = {
  ...COMMON_ACTIONS,
} as const;

export const ZONE_WEBSOCKET_METHODS = {
  ...COMMON_WEBSOCKET_METHODS,
} as const;
