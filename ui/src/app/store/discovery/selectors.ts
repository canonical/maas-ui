import { createSelector } from "@reduxjs/toolkit";

import { DiscoveryMeta } from "app/store/discovery/types";
import type { Discovery, DiscoveryState } from "app/store/discovery/types";
import { FilterDiscoveries } from "app/store/discovery/utils";
import type { RootState } from "app/store/root/types";
import { generateBaseSelectors } from "app/store/utils";

const defaultSelectors = generateBaseSelectors<
  DiscoveryState,
  Discovery,
  DiscoveryMeta.PK
>(DiscoveryMeta.MODEL, DiscoveryMeta.PK);

/**
 * Get discoveries using the MAAS search syntax.
 * @param state - The redux state.
 * @param filters - The filters to match against.
 * @returns A filtered list of discoveries.
 */
const search = createSelector(
  [
    defaultSelectors.all,
    (_state: RootState, filters: string | null) => ({
      filters,
    }),
  ],
  (items: Discovery[], { filters }) => {
    if (!filters) {
      return items;
    }
    return FilterDiscoveries.filterItems(items, filters);
  }
);

const selectors = {
  ...defaultSelectors,
  search,
};

export default selectors;
