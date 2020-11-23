import { generateBaseSelectors } from "app/store/utils";

import type { SSLKey, SSLKeyState } from "app/store/sslkey/types";

const searchFunction = (sslkey: SSLKey, term: string) =>
  sslkey.display.includes(term);

const selectors = generateBaseSelectors<SSLKeyState, SSLKey, "id">(
  "sslkey",
  "id",
  searchFunction
);

export default selectors;
