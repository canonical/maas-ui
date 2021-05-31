import { DomainMeta } from "app/store/domain/types";
import type { Domain, DomainState } from "app/store/domain/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (domain: Domain, term: string) =>
  domain.name.includes(term);

const selectors = generateBaseSelectors<DomainState, Domain, DomainMeta.PK>(
  DomainMeta.MODEL,
  DomainMeta.PK,
  searchFunction
);

export default selectors;
