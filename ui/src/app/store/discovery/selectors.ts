import { DiscoveryMeta } from "app/store/discovery/types";
import type { Discovery, DiscoveryState } from "app/store/discovery/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (discovery: Discovery, term: string) =>
  discovery.hostname?.toLowerCase().includes(term) ||
  discovery.mac_address?.toLowerCase().includes(term) ||
  discovery.mac_organization?.toLowerCase().includes(term) ||
  discovery.ip?.toLowerCase().includes(term) ||
  discovery.observer_hostname?.toLowerCase().includes(term) ||
  discovery.last_seen.toLowerCase().includes(term);

const selectors = generateBaseSelectors<
  DiscoveryState,
  Discovery,
  DiscoveryMeta.PK
>(DiscoveryMeta.MODEL, DiscoveryMeta.PK, searchFunction);

export default selectors;
