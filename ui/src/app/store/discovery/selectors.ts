import { DiscoveryMeta } from "app/store/discovery/types";
import type { Discovery, DiscoveryState } from "app/store/discovery/types";
import { generateBaseSelectors } from "app/store/utils";

// TODO: Placeholder search function for now. This will need to be updated to
// follow the same format as machine searching (i.e. filtering by more than just
// one parameter).
const searchFunction = (discovery: Discovery, term: string) =>
  discovery.discovery_id.includes(term);

const selectors = generateBaseSelectors<
  DiscoveryState,
  Discovery,
  DiscoveryMeta.PK
>(DiscoveryMeta.MODEL, DiscoveryMeta.PK, searchFunction);

export default selectors;
