import { MachineHeaderViews } from "./constants";
import type { MachineHeaderContent } from "./types";

import type { Machine, MachineActions } from "app/store/machine/types";
import { NodeActions, NodeStatus } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils/node";

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
  // the machine to actually perform the clone action. The destination machines
  // can only be in a subset of statuses.
  if (actionName === NodeActions.CLONE) {
    return [NodeStatus.READY, NodeStatus.FAILED_TESTING].includes(
      machine.status
    );
  }
  return machine.actions.includes(actionName);
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
        return getNodeActionTitle(name);
    }
  }
  return defaultTitle;
};
