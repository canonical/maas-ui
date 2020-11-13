import { useCallback } from "react";
import { useSelector } from "react-redux";

import { ACTIONS } from "app/store/machine/slice";
import type { MachineActionName } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";

/**
 * Create a callback for toggling the menu
 * @param onToggleMenu - The function to toggle the menu.
 * @param systemId - The machine id.
 * @returns The toggle callback.
 */
export const useToggleMenu = (
  onToggleMenu: (systemId: string, open: boolean) => void,
  systemId: string
): ((open: boolean) => void) => {
  return useCallback((open) => onToggleMenu(systemId, open), [
    onToggleMenu,
    systemId,
  ]);
};

/**
 * Determine the machines to perform an action on. If a machine is "active",
 * this means the app is in the machine details view so the action need only be
 * performed on that machine. Otherwise, perform the action on the machines
 * selected in state.
 * @param actionName - The name of the machine action e.g. "commission".
 * @returns object with machines to perform action on and count of currently
 * processing machines.
 */
export const useMachineActionForm = (
  actionName: MachineActionName
): {
  machinesToAction: Machine[];
  processingCount: number;
} => {
  const activeMachine = useSelector(machineSelectors.active);
  const selectedMachines = useSelector(machineSelectors.selected);
  const action = ACTIONS.find((action) => action.name === actionName);
  // If in the machine details view, the machine is not in selected state so
  // instead we use the regular selector.
  const processingMachines = useSelector(
    machineSelectors[activeMachine ? action.status : `${action.status}Selected`]
  ) as Machine[];
  const machinesToAction = activeMachine ? [activeMachine] : selectedMachines;

  return { machinesToAction, processingCount: processingMachines.length };
};
