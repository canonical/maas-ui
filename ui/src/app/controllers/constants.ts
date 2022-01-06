import { NodeActions } from "app/store/types/node";

export const ControllerActionHeaderViews = {
  DELETE_CONTROLLER: ["controllerActionForm", NodeActions.DELETE],
  IMPORT_IMAGES_CONTROLLER: ["controllerActionForm", NodeActions.IMPORT_IMAGES],
  OFF_CONTROLLER: ["controllerActionForm", NodeActions.OFF],
  ON_CONTROLLER: ["controllerActionForm", NodeActions.ON],
  OVERRIDE_FAILED_TESTING_CONTROLLER: [
    "controllerActionForm",
    NodeActions.OVERRIDE_FAILED_TESTING,
  ],
  SET_ZONE_CONTROLLER: ["controllerActionForm", NodeActions.SET_ZONE],
  TEST_CONTROLLER: ["controllerActionForm", NodeActions.TEST],
} as const;

export const ControllerNonActionHeaderViews = {
  ADD_CONTROLLER: ["controllerNonActionForm", "addController"],
} as const;

export const ControllerHeaderViews = {
  ...ControllerActionHeaderViews,
  ...ControllerNonActionHeaderViews,
} as const;
