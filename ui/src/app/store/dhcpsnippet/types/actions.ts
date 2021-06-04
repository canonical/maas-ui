import type { DHCPSnippet } from "./base";
import type { DHCPSnippetMeta } from "./enum";

import type { Model } from "app/store/types/model";

export type CreateParams = {
  description?: DHCPSnippet["description"];
  enabled?: DHCPSnippet["enabled"];
  global_snippet?: boolean;
  iprange?: Model["id"];
  name?: DHCPSnippet["name"];
  node?: DHCPSnippet["node"];
  subnet?: DHCPSnippet["subnet"];
  value?: DHCPSnippet["value"];
};

export type UpdateParams = CreateParams & {
  [DHCPSnippetMeta.PK]: DHCPSnippet[DHCPSnippetMeta.PK];
};
