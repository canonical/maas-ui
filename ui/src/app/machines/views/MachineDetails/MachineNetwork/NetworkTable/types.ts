import type { NetworkInterface, NetworkLink } from "app/store/machine/types";

export enum ExpandedState {
  ADD_ALIAS_OR_VLAN = "addAliasOrVlan",
  ADD_PHYSICAL = "addPhysical",
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
