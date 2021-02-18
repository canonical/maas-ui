import { useCallback, useEffect } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useSelector } from "react-redux";

import type { MachineActionName } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import { ACTIONS } from "app/store/machine/slice";
import type {
  Machine,
  MachineState,
  MachineStatus,
} from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { kebabToCamelCase } from "app/utils";

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
 * Determine the machines to perform an action on when using the "Take action"
 * menu. If a machine is "active", this means the app is in the machine details
 * view so the action need only be performed on that machine. Otherwise, perform
 * the action on the machines selected in state (checked in the machine list).
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
  const actionMethod = kebabToCamelCase(actionName);
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
      actionMethod
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

/**
 * Get the error, saved and saving state for a single machine performing a
 * single action.
 * @param systemId - system_id of the machine to check.
 * @param statusName - name of the relevant machine status e.g. "updatingDisk".
 * @param eventName - name of the machine event to filter errors by e.g. "updateDisk".
 * @param onSaved - function to execute when form successfully saved.
 * @returns object with errors, saved and saving state for machine performing
 * the action
 */
export const useMachineDetailsForm = (
  systemId: Machine["system_id"],
  statusKey: keyof MachineStatus,
  eventName?: string,
  onSaved?: () => void
): {
  errors: MachineState["eventErrors"][0]["error"];
  saved: boolean;
  saving: boolean;
} => {
  const statuses = useSelector((state: RootState) =>
    machineSelectors.getStatuses(state, systemId)
  );
  const errors = useSelector((state: RootState) =>
    machineSelectors.eventErrorsForIds(state, systemId, eventName)
  );
  const saving = statuses[statusKey];
  const previousSaving = usePrevious(saving);
  const saved = !saving && previousSaving && errors.length === 0;

  useEffect(() => {
    if (onSaved && saved) {
      onSaved();
    }
  }, [onSaved, saved]);

  return { errors: errors[0]?.error, saved, saving };
};
