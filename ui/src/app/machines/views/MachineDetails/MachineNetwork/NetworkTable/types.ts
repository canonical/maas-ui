import type { NetworkInterface, NetworkLink } from "app/store/machine/types";

export enum ExpandedState {
  REMOVE = "remove",
  MARK_DISCONNECTED = "markDisconnected",
  MARK_CONNECTED = "markConnected",
}

export type Expanded = {
  content: ExpandedState;
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
};

export type SetExpanded = (expanded: Expanded | null) => void;
