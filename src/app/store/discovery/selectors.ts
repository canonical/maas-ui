import { DiscoveryMeta } from "@/app/store/discovery/types";
import type { Discovery, DiscoveryState } from "@/app/store/discovery/types";
import { generateBaseSelectors } from "@/app/store/utils";

const defaultSelectors = generateBaseSelectors<
  DiscoveryState,
  Discovery,
  DiscoveryMeta.PK
>(DiscoveryMeta.MODEL, DiscoveryMeta.PK);

const selectors = {
  ...defaultSelectors,
};

export default selectors;
