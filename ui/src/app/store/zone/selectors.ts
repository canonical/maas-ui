import { generateBaseSelectors } from "app/store/utils";
import type { Zone, ZoneState } from "app/store/zone/types";

const searchFunction = (zone: Zone, term: string) => zone.name.includes(term);

const selectors = generateBaseSelectors<ZoneState, "id">(
  "zone",
  "id",
  searchFunction
);

export default selectors;
