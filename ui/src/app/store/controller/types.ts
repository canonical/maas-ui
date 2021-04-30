import type { TSFixMe } from "app/base/types";
import type { NodeActions, BaseNode, NodeType } from "app/store/types/node";
import type { GenericState } from "app/store/types/state";

export enum ControllerInstallType {
  UNKNOWN = "",
  SNAP = "snap",
  DEB = "deb",
}

export type ControllerVersionInfo = {
  snap_revision?: string;
  version: string;
};

export type ControllerVersions = {
  current: ControllerVersionInfo;
  install_type?: ControllerInstallType;
  origin: string;
  snap_cohort?: string;
  update?: ControllerVersionInfo;
};

export type ControllerVlansHA = {
  false: number;
  true: number;
};

export type ControllerActions =
  | NodeActions.DELETE
  | NodeActions.IMPORT_IMAGES
  | NodeActions.OFF
  | NodeActions.ON
  | NodeActions.OVERRIDE_FAILED_TESTING
  | NodeActions.SET_ZONE
  | NodeActions.TEST;

export type Controller = BaseNode & {
  actions: ControllerActions[];
  last_image_sync: string;
  node_type:
    | NodeType.RACK_CONTROLLER
    | NodeType.REGION_CONTROLLER
    | NodeType.REGION_AND_RACK_CONTROLLER;
  service_ids: number[];
  versions: ControllerVersions | null;
  vlans_ha?: ControllerVlansHA;
};

export type ControllerState = GenericState<Controller, TSFixMe>;
