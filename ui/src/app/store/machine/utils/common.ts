import type { Machine, MachineDetails } from "app/store/machine/types";
/**
 * Wether a machine has a Machine or MachineDetails type.
 * @param machine - The machine to check
 * @returns Whether the machine is MachineDetails.
 */
export const isMachineDetails = (
  machine?: Machine | MachineDetails | null
  // Use "metadata" as the canary as it only exists for MachineDetails.
): machine is MachineDetails => !!machine && "metadata" in machine;
