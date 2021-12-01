import { useEffect } from "react";

import type { ButtonProps, MenuLink } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import { actions as generalActions } from "app/store/general";
import {
  machineActions as machineActionsSelectors,
  powerTypes as powerTypesSelectors,
} from "app/store/general/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import type { Node } from "app/store/types/node";
import { kebabToCamelCase } from "app/utils";

/**
 * Generate menu items for the available actins on a machine.
 * @param systemId - The system id for a machine.
 * @param actions - The actions to generate menu items for.
 * @param noneMessage - The message to display if there are no items.
 * @param onClick - A function to call when the item is clicked.
 */
export const useMachineActions = (
  systemId: Machine["system_id"],
  actions: Machine["actions"],
  noneMessage?: string | null,
  onClick?: () => void
): ButtonProps[] => {
  const dispatch = useDispatch();
  const generalMachineActions = useSelector(machineActionsSelectors.get);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const actionLinks: MenuLink = [];
  if (machine) {
    actions.forEach((action) => {
      if (machine.actions.includes(action)) {
        let actionLabel = action.toString();
        generalMachineActions.forEach((machineAction) => {
          if (machineAction.name === action) {
            actionLabel = machineAction.title;
          }
        });

        actionLinks.push({
          children: actionLabel,
          onClick: () => {
            const actionMethod = kebabToCamelCase(action);
            // Find the method for the function.
            const [, actionFunction] =
              Object.entries(machineActions).find(
                ([key]) => key === actionMethod
              ) || [];
            if (actionFunction) {
              dispatch(actionFunction(systemId));
            }
            onClick && onClick();
          },
        });
      }
    });
    if (actionLinks.length === 0 && noneMessage) {
      return [
        {
          children: noneMessage,
          disabled: true,
        },
      ];
    }
  }
  return actionLinks;
};

/**
 * Check if the rack controller is connected.
 * @returns Whether the rack controller is connected.
 */
export const useIsRackControllerConnected = (): boolean => {
  const dispatch = useDispatch();
  const powerTypes = useSelector(powerTypesSelectors.get);

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
  }, [dispatch]);

  // If power types exist then a rack controller is connected.
  return powerTypes.length > 0;
};

/**
 * Check if a node can be edited.
 * @param node - A node object.
 * @param ignoreRackControllerConnection - Whether the editable check should
 *                                         include whether the rack controller
 *                                          is connected.
 * @returns Whether the node can be edited.
 */
export const useCanEdit = (
  node?: Node | null,
  ignoreRackControllerConnection = false
): boolean => {
  const isRackControllerConnected = useIsRackControllerConnected();
  if (!node) {
    return false;
  }
  const isLocked = "locked" in node && node.locked;
  return (
    node.permissions.includes("edit") &&
    !isLocked &&
    (ignoreRackControllerConnection || isRackControllerConnected)
  );
};
