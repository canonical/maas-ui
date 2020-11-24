import type { Fabric, FabricState } from "app/store/fabric/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (fabric: Fabric, term: string) =>
  fabric.name.includes(term);

const selectors = generateBaseSelectors<FabricState, Fabric, "id">(
  "fabric",
  "id",
  searchFunction
);

export default selectors;
