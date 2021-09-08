import { MachineHeaderViews } from "./constants";
import type { MachineHeaderContent } from "./types";

import type { Machine, MachineActions } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

/**
 * Determine whether a machine can open an action form for a particular action.
 * @param machine - The machine to check.
 * @param actionName - The name of the action to check, e.g. "commission"
 * @returns Whether the machine can open the action form.
 */
export const canOpenActionForm = (
  machine: Machine | null,
  actionName: MachineActions | null
): boolean => {
  if (!machine || !actionName) {
    return false;
  }
  // Cloning in the UI works inverse to the rest of the machine actions - we
  // select the destination machines first then when the form is open we select
  // the machine to actually perform the clone action.
  if (actionName === NodeActions.CLONE) {
    return true;
  }
  return machine.actions.includes(actionName);
};

/**
 * Get action title from name.
 * @param actionName - The name of the action to check.
 * @returns Formatted action title.
 */
export const getActionTitle = (actionName: MachineActions): string => {
  switch (actionName) {
    case NodeActions.ABORT:
      return "Abort";
    case NodeActions.ACQUIRE:
      return "Acquire";
    case NodeActions.CLONE:
      return "Clone from";
    case NodeActions.COMMISSION:
      return "Commission";
    case NodeActions.DELETE:
      return "Delete";
    case NodeActions.DEPLOY:
      return "Deploy";
    case NodeActions.EXIT_RESCUE_MODE:
      return "Exit rescue mode";
    case NodeActions.LOCK:
      return "Lock";
    case NodeActions.MARK_BROKEN:
      return "Mark broken";
    case NodeActions.MARK_FIXED:
      return "Mark fixed";
    case NodeActions.OFF:
      return "Power off";
    case NodeActions.ON:
      return "Power on";
    case NodeActions.OVERRIDE_FAILED_TESTING:
      return "Override failed testing";
    case NodeActions.RELEASE:
      return "Release";
    case NodeActions.RESCUE_MODE:
      return "Enter rescue mode";
    case NodeActions.SET_POOL:
      return "Set pool";
    case NodeActions.SET_ZONE:
      return "Set zone";
    case NodeActions.TAG:
      return "Tag";
    case NodeActions.TEST:
      return "Test";
    case NodeActions.UNLOCK:
      return "Unlock";
    default:
      return "Action";
  }
};

/**
 * Get title depending on header content.
 * @param defaultTitle - Title to show if no header content open.
 * @param headerContentName - The name of the header content to check.
 * @returns Header title string.
 */
export const getHeaderTitle = (
  defaultTitle: string,
  headerContent: MachineHeaderContent | null
): string => {
  if (headerContent) {
    const [, name] = headerContent.view;
    switch (name) {
      case MachineHeaderViews.ADD_CHASSIS[1]:
        return "Add chassis";
      case MachineHeaderViews.ADD_MACHINE[1]:
        return "Add machine";
      default:
        return getActionTitle(name);
    }
  }
  return defaultTitle;
};
