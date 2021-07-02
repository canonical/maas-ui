import { DiscoveryMeta } from "app/store/discovery/types";
import type { Discovery } from "app/store/discovery/types";
import type { FilterValue } from "app/utils/search/filter-handlers";
import {
  isFilterValue,
  isFilterValueArray,
} from "app/utils/search/filter-handlers";
import FilterItems from "app/utils/search/filter-items";

export const getDiscoveryValue = (
  dicovery: Discovery,
  filter: string
): FilterValue | FilterValue[] | null => {
  let value: FilterValue | FilterValue[] | null = null;
  if (dicovery.hasOwnProperty(filter)) {
    const dicoveryValue = dicovery[filter as keyof Discovery];
    // Only return values that are valid for filters.
    if (isFilterValue(dicoveryValue) || isFilterValueArray(dicoveryValue)) {
      value = dicoveryValue;
    }
  }
  return value;
};

export const FilterDiscoveries = new FilterItems<Discovery, DiscoveryMeta.PK>(
  DiscoveryMeta.PK,
  getDiscoveryValue
);
