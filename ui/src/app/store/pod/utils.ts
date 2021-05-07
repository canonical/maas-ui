import type { Pod, PodNuma, PodResource } from "app/store/pod/types";
import { PodType } from "app/store/pod/types";

export const formatHostType = (type: PodType): string => {
  switch (type) {
    case PodType.LXD:
      return "LXD";
    case PodType.VIRSH:
      return "Virsh";
    default:
      return type;
  }
};

/**
 * Returns the indices of the pod cores that are either allocated or free.
 * @param pod - the pod to check.
 * @param key - which of either "allocated" or "free" to collate
 * @returns list of core indices that are either allocated or free
 */
export const getCoreIndices = (
  pod: Pod,
  key: keyof PodNuma["cores"]
): number[] => {
  if (!pod?.resources?.numa?.length) {
    return [];
  }
  return pod.resources.numa
    .reduce<number[]>((cores, numa) => [...cores, ...numa.cores[key]], [])
    .sort();
};

/**
 * Returns a resource's usage taking over-commit into account.
 * @param resource - the pod resource to check.
 * @param overCommit - the over-commit ratio of that resource.
 * @returns the resource's usage with over-commit.
 */
export const resourceWithOverCommit = (
  resource: PodResource,
  overCommit: number
): PodResource => {
  if (overCommit === 1) {
    return resource;
  }
  const totalAllocated = resource.allocated_other + resource.allocated_tracked;
  const total = totalAllocated + resource.free;
  const overCommitted = total * overCommit;
  return {
    allocated_other: resource.allocated_other,
    allocated_tracked: resource.allocated_tracked,
    free: overCommitted - totalAllocated,
  };
};
