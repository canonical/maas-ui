import { KVMHeaderViews } from "./constants";
import type { KVMHeaderContent } from "./types";

import type { MachineHeaderContent } from "app/machines/types";
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
 * @param headerContent - The currently selected header content.
 * @returns Header title.
 */
export const getFormTitle = (headerContent: KVMHeaderContent): string => {
  switch (headerContent.view) {
    case KVMHeaderViews.ADD_KVM:
      return "Add KVM";
    case KVMHeaderViews.COMPOSE_VM:
      return "Compose";
    case KVMHeaderViews.DELETE_KVM:
      return "Delete";
    case KVMHeaderViews.REFRESH_KVM:
      return "Refresh";
    default:
      // We need to explicitly cast headerContent here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical-web-and-design/maas-ui/issues/3040
      const machineHeaderContent = headerContent as MachineHeaderContent;
      return getMachineHeaderTitle("", machineHeaderContent);
  }
};
