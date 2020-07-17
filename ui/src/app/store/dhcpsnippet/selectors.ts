import { generateBaseSelectors } from "app/store/utils";
import type {
  DHCPSnippet,
  DHCPSnippetState,
} from "app/store/dhcpsnippet/types";

const searchFunction = (snippet: DHCPSnippet, term: string) =>
  snippet.name.includes(term) || snippet.description.includes(term);

const selectors = generateBaseSelectors<DHCPSnippetState, "id">(
  "dhcpsnippet",
  "id",
  searchFunction
);

export default selectors;
