import type { ControllerInstallType, ControllerVersionIssues } from "./enum";

import type { APIError } from "app/base/types";
import type {
  NodeActions,
  BaseNode,
  NodeType,
  NodeTypeDisplay,
  NodeLinkType,
} from "app/store/types/node";
import type { GenericState } from "app/store/types/state";

export type ControllerVersionInfo = {
  snap_revision?: string;
  version: string;
};

export type ControllerVersions = {
  current: ControllerVersionInfo;
  install_type?: ControllerInstallType;
  origin: string;
  snap_cohort?: string;
  up_to_date: boolean;
  update?: ControllerVersionInfo;
  issues: ControllerVersionIssues[];
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
  link_type: NodeLinkType.CONTROLLER;
  node_type_display:
    | NodeTypeDisplay.RACK_CONTROLLER
    | NodeTypeDisplay.REGION_CONTROLLER
    | NodeTypeDisplay.REGION_AND_RACK_CONTROLLER;
  node_type:
    | NodeType.RACK_CONTROLLER
    | NodeType.REGION_CONTROLLER
    | NodeType.REGION_AND_RACK_CONTROLLER;
  service_ids: number[];
  versions: ControllerVersions | null;
  vlans_ha?: ControllerVlansHA;
};

export type ControllerState = GenericState<Controller, APIError>;
