import { PodAction } from "app/store/pod/types";
import { formatBytes } from "app/utils";

/**
 * Returns a string with the formatted byte value and unit, e.g 1024 => "1KiB"
 *
 * @param memory - the memory in bytes
 * @returns formatted memory string with value and unit
 */
export const memoryWithUnit = (memory: number): string => {
  const formatted = formatBytes(memory, "B", { binary: true });
  return `${formatted.value}${formatted.unit}`;
};

/**
 * Get action title from name.
 * @param actionName - The name of the action to check.
 * @returns Formatted action title.
 */
export const getActionTitle = (actionName: PodAction): string => {
  switch (actionName) {
    case PodAction.COMPOSE:
      return "Compose";
    case PodAction.DELETE:
      return "Delete";
    case PodAction.REFRESH:
      return "Refresh";
    default:
      return "Action";
  }
};
