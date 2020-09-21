import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { DHCPSnippet, DHCPSnippetState } from "./types";

type DHCPSnippetReducers = SliceCaseReducers<DHCPSnippetState>;

export type DHCPSnippetSlice = GenericSlice<
  DHCPSnippetState,
  DHCPSnippet,
  DHCPSnippetReducers
>;

const dhcpSnippetSlice = generateSlice<
  DHCPSnippet,
  DHCPSnippetState["errors"],
  DHCPSnippetReducers
>({
  name: "dhcpsnippet",
}) as DHCPSnippetSlice;

export const { actions } = dhcpSnippetSlice;

export default dhcpSnippetSlice.reducer;
