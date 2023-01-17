import { KVMHeaderViews } from "./constants";
import type {
  KVMHeaderContent,
  KVMStoragePoolResource,
  KVMStoragePoolResources,
} from "./types";

import type { MachineHeaderContent } from "app/machines/types";
import { getHeaderTitle as getMachineHeaderTitle } from "app/machines/utils";
import type { Pod } from "app/store/pod/types";
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
 * @param sidePanelContent - The currently selected header content.
 * @returns Header title.
 */
export const getFormTitle = (sidePanelContent: KVMHeaderContent): string => {
  switch (sidePanelContent.view) {
    case KVMHeaderViews.ADD_LXD_HOST:
      return "Add LXD host";
    case KVMHeaderViews.ADD_VIRSH_HOST:
      return "Add Virsh host";
    case KVMHeaderViews.COMPOSE_VM:
      return "Compose";
    case KVMHeaderViews.DELETE_KVM:
      return "Delete";
    case KVMHeaderViews.REFRESH_KVM:
      return "Refresh";
    default:
      // We need to explicitly cast sidePanelContent here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical/maas-ui/issues/3040
      const machineHeaderContent = sidePanelContent as MachineHeaderContent;
      return getMachineHeaderTitle("", machineHeaderContent);
  }
};

export const getHeaderSize = (
  sidePanelContent: KVMHeaderContent
): "wide" | undefined => {
  switch (sidePanelContent.view) {
    case KVMHeaderViews.COMPOSE_VM:
      return "wide";
    default:
      return undefined;
  }
};

/**
 * Calculate the amount of free storage in a storage pool.
 * @param resource - The storage pool resource to calculate free storage.
 * @returns Free storage in pool.
 */
export const calcFreePoolStorage = (resource: KVMStoragePoolResource): number =>
  resource.total - resource.allocated_other - resource.allocated_tracked;

/**
 * Convert a pod or cluster's storage pool resources object into a sorted array.
 * @param pools - The pod or cluster's storage pool resources object.
 * @param defaultPoolId - the default pool id of the pod.
 * @returns a sorted list of storage pools in the pod or cluster.
 */
export const getSortedPoolsArray = (
  pools: KVMStoragePoolResources,
  defaultPoolId?: Pod["default_storage_pool"]
): [name: string, resource: KVMStoragePoolResource][] => {
  const poolsArray = Object.entries<KVMStoragePoolResource>(pools);

  return poolsArray.sort(([nameA, dataA], [nameB, dataB]) => {
    if (defaultPoolId && "id" in dataA && "id" in dataB) {
      // Pools in pods will have an id. For this case we sort by default first
      // (as defined in pod.default_storage_pool) then by id.
      if (
        dataA.id === defaultPoolId ||
        (dataB.id !== defaultPoolId && dataA.id < dataB.id)
      ) {
        return -1;
      } else if (dataB.id === defaultPoolId || dataA.id > dataB.id) {
        return 1;
      }
      return 0;
    }

    // Pools in clusters do not have a single id, as they can span multiple
    // pods. For this case we just sort by name;
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};
