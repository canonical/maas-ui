import { SSLKeyMeta } from "app/store/sslkey/types";
import type { SSLKey, SSLKeyState } from "app/store/sslkey/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (sslkey: SSLKey, term: string) =>
  sslkey.display.includes(term);

const selectors = generateBaseSelectors<SSLKeyState, SSLKey, SSLKeyMeta.PK>(
  SSLKeyMeta.MODEL,
  SSLKeyMeta.PK,
  searchFunction
);

export default selectors;
