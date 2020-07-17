import { generateBaseSelectors } from "app/store/utils";
import type { TokenState } from "app/store/token/types";

const selectors = generateBaseSelectors<TokenState, "id">("token", "id");

export default selectors;
