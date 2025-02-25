import type { FetchParams } from "../types";

import { mapSortDirection } from "./common";
import type { UseFetchMachinesOptions } from "./hooks";

export function timeUntilStale(updatedAt: number, staleTime?: number): number {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}

export const transformToFetchParams = (
  options?: UseFetchMachinesOptions | null
): FetchParams | null => {
  return options
    ? {
        filter: options.filters ?? null,
        group_collapsed: options.collapsedGroups,
        group_key: options.grouping ?? null,
        page_number: options?.pagination?.currentPage,
        page_size: options?.pagination?.pageSize,
        sort_direction: mapSortDirection(options.sortDirection),
        sort_key: options.sortKey ?? null,
      }
    : null;
};

export const generateCallId = (options?: object | null): string => {
  return options ? JSON.stringify(sortObjectKeys(options)) : "{}";
};

function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortObjectKeys(obj[key]);
      return result;
    }, {} as any);
}
