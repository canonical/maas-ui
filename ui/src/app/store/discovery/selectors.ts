import { DiscoveryMeta } from "app/store/discovery/types";
import type { Discovery, DiscoveryState } from "app/store/discovery/types";
import { generateBaseSelectors } from "app/store/utils";

const selectors = generateBaseSelectors<
  DiscoveryState,
  Discovery,
  DiscoveryMeta.PK
>(DiscoveryMeta.MODEL, DiscoveryMeta.PK);

export default selectors;
