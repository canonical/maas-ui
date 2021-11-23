import { NodeActions } from "app/store/types/node";

export const DeviceActionHeaderViews = {
  DELETE_DEVICE: ["deviceActionForm", NodeActions.DELETE],
  SET_ZONE_DEVICE: ["deviceActionForm", NodeActions.SET_ZONE],
} as const;

export const DeviceNonActionHeaderViews = {
  ADD_DEVICE: ["deviceNonActionForm", "addDevice"],
} as const;

export const DeviceHeaderViews = {
  ...DeviceActionHeaderViews,
  ...DeviceNonActionHeaderViews,
} as const;
