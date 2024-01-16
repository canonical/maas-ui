import { NodeActions } from "@/app/store/types/node";

export const DeviceActionHeaderViews = {
  DELETE_DEVICE: ["deviceActionForm", NodeActions.DELETE],
  SET_ZONE_DEVICE: ["deviceActionForm", NodeActions.SET_ZONE],
} as const;

export const DeviceNonActionHeaderViews = {
  ADD_DEVICE: ["deviceNonActionForm", "addDevice"],
  ADD_INTERFACE: ["deviceNonActionForm", "addInterface"],
  EDIT_INTERFACE: ["deviceNonActionForm", "editInterface"],
  REMOVE_INTERFACE: ["deviceNonActionForm", "removeInterface"],
} as const;

export const DeviceSidePanelViews = {
  ...DeviceActionHeaderViews,
  ...DeviceNonActionHeaderViews,
} as const;
