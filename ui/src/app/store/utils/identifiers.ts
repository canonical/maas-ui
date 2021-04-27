import type { Machine } from "app/store/machine/types";
import type { Host } from "app/store/types/host";

/**
 * Type guard to determine if host is a machine.
 * @param {Host} host - a machine or controller.
 */
export const isMachine = (host: Host): host is Machine =>
  (host as Machine).link_type === "machine";
