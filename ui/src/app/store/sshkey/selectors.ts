import { SSHKeyMeta } from "app/store/sshkey/types";
import type { SSHKey, SSHKeyState } from "app/store/sshkey/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (sshkey: SSHKey, term: string) =>
  sshkey.display.includes(term);

const selectors = generateBaseSelectors<SSHKeyState, SSHKey, SSHKeyMeta.PK>(
  SSHKeyMeta.MODEL,
  SSHKeyMeta.PK,
  searchFunction
);

export default selectors;
