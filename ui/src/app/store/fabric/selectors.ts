import { generateBaseSelectors } from "app/store/utils";
import type { Fabric, FabricState } from "app/store/fabric/types";

const searchFunction = (fabric: Fabric, term: string) =>
  fabric.name.includes(term);

const selectors = generateBaseSelectors<FabricState, Fabric, "id">(
  "fabric",
  "id",
  searchFunction
);

export default selectors;
