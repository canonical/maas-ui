import { generateBaseSelectors } from "app/store/utils";

import type { Token, TokenState } from "app/store/token/types";

const selectors = generateBaseSelectors<TokenState, Token, "id">("token", "id");

export default selectors;
