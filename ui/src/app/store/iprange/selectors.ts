import { IPRangeMeta } from "app/store/iprange/types";
import type { IPRange, IPRangeState } from "app/store/iprange/types";
import { generateBaseSelectors } from "app/store/utils";

const selectors = generateBaseSelectors<IPRangeState, IPRange, IPRangeMeta.PK>(
  IPRangeMeta.MODEL,
  IPRangeMeta.PK
);

export default selectors;
