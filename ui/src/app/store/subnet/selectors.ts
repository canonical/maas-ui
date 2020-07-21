import { generateBaseSelectors } from "app/store/utils";
import type { Subnet, SubnetState } from "app/store/subnet/types";

const searchFunction = (subnet: Subnet, term: string) =>
  subnet.name.includes(term);

const selectors = generateBaseSelectors<SubnetState, Subnet, "id">(
  "subnet",
  "id",
  searchFunction
);

export default selectors;
