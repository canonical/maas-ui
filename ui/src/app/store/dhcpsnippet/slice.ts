import { createSlice } from "@reduxjs/toolkit";

import type { DHCPSnippetState } from "./types";
import { DHCPSnippetMeta } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const dhcpSnippetSlice = createSlice({
  name: DHCPSnippetMeta.MODEL,
  initialState: genericInitialState as DHCPSnippetState,
  reducers: generateCommonReducers<DHCPSnippetState, DHCPSnippetMeta.PK>(
    DHCPSnippetMeta.MODEL,
    DHCPSnippetMeta.PK
  ),
});

export const { actions } = dhcpSnippetSlice;

export default dhcpSnippetSlice.reducer;
