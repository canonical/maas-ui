import { generateBaseSelectors } from "app/store/utils";
import { ZoneMeta } from "app/store/zone/types";
import type { Zone, ZoneState } from "app/store/zone/types";

const searchFunction = (zone: Zone, term: string) => zone.name.includes(term);

const selectors = generateBaseSelectors<ZoneState, Zone, ZoneMeta.PK>(
  ZoneMeta.MODEL,
  ZoneMeta.PK,
  searchFunction
);

export default selectors;
