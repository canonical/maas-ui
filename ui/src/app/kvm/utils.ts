import { KVMHeaderNames } from "./constants";
import type { KVMHeaderContent } from "./types";

import { getHeaderTitle as getMachineHeaderTitle } from "app/machines/utils";
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
 * Get header title depending on header content.
 * @param defaultTitle - The title to show if no header content is selected.
 * @param headerContent - The currently selected header content.
 * @returns Header title.
 */
export const getHeaderTitle = (
  defaultTitle: string,
  headerContent: KVMHeaderContent | null
): string => {
  if (headerContent) {
    switch (headerContent.name) {
      case KVMHeaderNames.ADD_KVM:
        return "Add KVM";
      case KVMHeaderNames.COMPOSE_VM:
        return "Compose";
      case KVMHeaderNames.DELETE_KVM:
        return "Delete";
      case KVMHeaderNames.REFRESH_KVM:
        return "Refresh";
      default:
        return getMachineHeaderTitle(defaultTitle, headerContent);
    }
  }
  return defaultTitle;
};
