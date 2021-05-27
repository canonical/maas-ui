import { createSlice } from "@reduxjs/toolkit";

import type { DHCPSnippetState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const dhcpSnippetSlice = createSlice({
  name: "dhcpsnippet",
  initialState: genericInitialState as DHCPSnippetState,
  reducers: generateCommonReducers<DHCPSnippetState, "id">("dhcpsnippet", "id"),
});

export const { actions } = dhcpSnippetSlice;

export default dhcpSnippetSlice.reducer;
