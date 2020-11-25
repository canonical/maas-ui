import type {
  DHCPSnippet,
  DHCPSnippetState,
} from "app/store/dhcpsnippet/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (snippet: DHCPSnippet, term: string) =>
  snippet.name.includes(term) || snippet.description.includes(term);

const selectors = generateBaseSelectors<DHCPSnippetState, DHCPSnippet, "id">(
  "dhcpsnippet",
  "id",
  searchFunction
);

export default selectors;
