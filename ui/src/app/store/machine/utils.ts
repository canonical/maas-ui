import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { general as generalActions } from "app/base/actions";
import generalSelectors from "app/store/general/selectors";
import type { Machine } from "app/store/machine/types";

/**
 * Check if a machine has an invalid architecture.
 * @param machine - A machine object.
 * @returns Whether the machine has an invalid architecture.
 */
export const useHasInvalidArchitecture = (
  machine?: Machine | null
): boolean => {
  const dispatch = useDispatch();
  const architectures = useSelector(generalSelectors.architectures.get);

  useEffect(() => {
    dispatch(generalActions.fetchArchitectures());
  }, [dispatch]);

  if (!machine) {
    return false;
  }

  return (
    machine.architecture === "" || !architectures.includes(machine.architecture)
  );
};

/**
 * Check if the rack controller is connected.
 * @returns Whether the rack controller is connected.
 */
export const useIsRackControllerConnected = (): boolean => {
  const dispatch = useDispatch();
  const powerTypes = useSelector(generalSelectors.powerTypes.get);

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
  }, [dispatch]);

  // If power types exist then a rack controller is connected.
  return powerTypes.length > 0;
};

/**
 * Check if a machine can be edited.
 * @param machine - A machine object.
 * @param ignoreRackControllerConnection - Whether the editable check should
 *                                         include whether the rack controller
 *                                          is connected.
 * @returns Whether the machine can be edited.
 */
export const useCanEdit = (
  machine?: Machine | null,
  ignoreRackControllerConnection = false
): boolean => {
  const isRackControllerConnected = useIsRackControllerConnected();
  if (!machine) {
    return false;
  }
  return (
    machine.permissions.includes("edit") &&
    !machine.locked &&
    (ignoreRackControllerConnection || isRackControllerConnected)
  );
};
