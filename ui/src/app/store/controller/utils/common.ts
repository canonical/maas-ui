import type { Controller, ControllerDetails } from "app/store/controller/types";

/**
 * Returns whether a controller is of type ControllerDetails.
 * @param controller - The controller to check
 * @returns Whether the controller is of type ControllerDetails.
 */
export const isControllerDetails = (
  controller?: Controller | null
  // Use "interfaces" as the canary as it only exists for ControllerDetails.
): controller is ControllerDetails =>
  !!controller && "interfaces" in controller;
