import { useCallback } from "react";

import { useSelector } from "react-redux";

import type { MachineActionName } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import { ACTIONS } from "app/store/machine/slice";
import type { Machine, MachineState } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

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
  actionName: MachineActionName | "check-power"
): {
  errors: MachineState["eventErrors"][0]["error"];
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
  const errors = useSelector((state: RootState) =>
    machineSelectors.eventErrorsForIds(
      state,
      machinesToAction.map(({ system_id }) => system_id),
      actionName
    )
  );
  return {
    // The form expects only one error. This will be the case if we are acting
    // on the selected machine, but in the case of the machine list we presume
    // that the same error will be returned for all machines.
    errors: errors[0]?.error,
    machinesToAction,
    processingCount: processingMachines.length,
  };
};
