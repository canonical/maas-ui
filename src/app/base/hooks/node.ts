import { useSelector } from "react-redux";

import { useFetchActions } from "@/app/base/hooks";
import { generalActions } from "@/app/store/general";
import { powerTypes as powerTypesSelectors } from "@/app/store/general/selectors";
import type { Node } from "@/app/store/types/node";

/**
 * Check if the rack controller is connected.
 * @returns Whether the rack controller is connected.
 */
export const useIsRackControllerConnected = (): boolean => {
  const powerTypes = useSelector(powerTypesSelectors.get);

  useFetchActions([generalActions.fetchPowerTypes]);

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
