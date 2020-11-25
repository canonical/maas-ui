import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { DHCPSnippet, DHCPSnippetState } from "./types";

type DHCPSnippetReducers = SliceCaseReducers<DHCPSnippetState>;

export type DHCPSnippetSlice = GenericSlice<
  DHCPSnippetState,
  DHCPSnippet,
  DHCPSnippetReducers
>;

const dhcpSnippetSlice = generateSlice<
  DHCPSnippet,
  DHCPSnippetState["errors"],
  DHCPSnippetReducers,
  "id"
>({
  indexKey: "id",
  name: "dhcpsnippet",
}) as DHCPSnippetSlice;

export const { actions } = dhcpSnippetSlice;

export default dhcpSnippetSlice.reducer;
