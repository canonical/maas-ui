import { generateBaseSelectors } from "app/store/utils";

import type { VLAN, VLANState } from "app/store/vlan/types";

const searchFunction = (vlan: VLAN, term: string) => vlan.name.includes(term);

const selectors = generateBaseSelectors<VLANState, VLAN, "id">(
  "vlan",
  "id",
  searchFunction
);

export default selectors;
