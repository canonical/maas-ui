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
    return true; // TODO - add basic validation for what can be cloned to.
  }
  return machine.actions.includes(actionName);
};
