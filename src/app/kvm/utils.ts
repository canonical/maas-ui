import { formatBytes } from "@canonical/maas-react-components";

import { KVMSidePanelViews } from "./constants";
import type { KVMStoragePoolResource, KVMStoragePoolResources } from "./types";

import type { SidePanelContent } from "@/app/base/side-panel-context";
import type { Pod } from "@/app/store/pod/types";
import { getSidePanelTitle } from "@/app/store/utils/node/base";

/**
 * Returns a string with the formatted byte value and unit, e.g 1024 => "1KiB"
 *
 * @param memory - the memory in bytes
 * @returns formatted memory string with value and unit
 */
export const memoryWithUnit = (memory: number): string => {
  const formatted = formatBytes({ value: memory, unit: "B" }, { binary: true });
  return `${formatted.value}${formatted.unit}`;
};

const kvmSidePanelTitleMap = {
  [KVMSidePanelViews.ADD_LXD_HOST[1]]: "Add LXD host",
  [KVMSidePanelViews.ADD_VIRSH_HOST[1]]: "Add Virsh host",
  [KVMSidePanelViews.COMPOSE_VM[1]]: "Compose",
  [KVMSidePanelViews.DELETE_KVM[1]]: "Delete",
  [KVMSidePanelViews.REFRESH_KVM[1]]: "Refresh",
} as const;

/**
 * Get header title depending on header content.
 * @param sidePanelContent - The currently selected header content.
 * @returns Header title.
 */
export const getFormTitle = (sidePanelContent: SidePanelContent): string => {
  if (sidePanelContent && sidePanelContent.view) {
    const [, title] = sidePanelContent.view;
    if (title && title in kvmSidePanelTitleMap) {
      return kvmSidePanelTitleMap[title as keyof typeof kvmSidePanelTitleMap];
    }
  }

  // We need to explicitly cast sidePanelContent here - TypeScript doesn't
  // seem to be able to infer remaining object tuple values as with string
  // values.
  // https://github.com/canonical/maas-ui/issues/3040
  const machineSidePanelContent = sidePanelContent;
  return getSidePanelTitle("", machineSidePanelContent);
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
