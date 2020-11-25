import type { Token, TokenState } from "app/store/token/types";
import { generateBaseSelectors } from "app/store/utils";

const selectors = generateBaseSelectors<TokenState, Token, "id">("token", "id");

export default selectors;
