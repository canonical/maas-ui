import type { NetworkInterface, NetworkLink } from "app/store/machine/types";

export enum ExpandedState {
  ADD_ALIAS = "addAlias",
  ADD_BOND = "addBond",
  ADD_BRIDGE = "addBridge",
  ADD_PHYSICAL = "addPhysical",
  ADD_VLAN = "addVlan",
  DISCONNECTED_WARNING = "disconnectedWarning",
  EDIT = "edit",
  MARK_CONNECTED = "markConnected",
  MARK_DISCONNECTED = "markDisconnected",
  REMOVE = "remove",
}

export type Expanded = {
  content: ExpandedState;
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
};

export type SetExpanded = (expanded: Expanded | null) => void;

export type Selected = {
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
};

export type SetSelected = (selected: Selected[]) => void;
