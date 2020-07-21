import { generateBaseSelectors } from "app/store/utils";
import type { SSHKey, SSHKeyState } from "app/store/sshkey/types";

const searchFunction = (sshkey: SSHKey, term: string) =>
  sshkey.display.includes(term);

const selectors = generateBaseSelectors<SSHKeyState, SSHKey, "id">(
  "sshkey",
  "id",
  searchFunction
);

export default selectors;
