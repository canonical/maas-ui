import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { ACTIONS } from "app/base/reducers/machine/machine";
import type { RouteParams } from "app/base/types";
import type { MachineActionName } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
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
 * Determine the machines to perform an action on. If "id" is present in the
 * route params, this means the app is in the machine details view so the action
 * need only be performed on that machine. Otherwise, perform the action on the
 * machines selected in state.
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
  const { id } = useParams<RouteParams>();
  const machineFromID = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const selectedMachines = useSelector(machineSelectors.selected);
  const action = ACTIONS.find((action) => action.name === actionName);
  // If in the machine details view, the machine is not in selected state so
  // instead we use the regular selector.
  const processingMachines = useSelector(
    machineSelectors[id ? action.status : `${action.status}Selected`]
  ) as Machine[];
  const machinesToAction = id ? [machineFromID] : selectedMachines;

  return { machinesToAction, processingCount: processingMachines.length };
};
