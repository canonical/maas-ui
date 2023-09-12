import type { Machine } from "app/store/machine/types";
import { NodeStatusCode } from "app/store/types/node";

/**
 * Check if a machine is deployed ephemerally or not
 * @param machine - A machine object
 * @returns boolean value
 */
export const isEphemerallyDeployed = (machine: Machine | null) => {
  return (
    machine &&
    machine.status_code === NodeStatusCode.DEPLOYED &&
    machine.ephemeral_deploy
  );
};
