import { createSlice } from "@reduxjs/toolkit";

import type { CreateParams, DHCPSnippetState, UpdateParams } from "./types";
import { DHCPSnippetMeta } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const dhcpSnippetSlice = createSlice({
  initialState: genericInitialState as DHCPSnippetState,
  name: DHCPSnippetMeta.MODEL,
  reducers: generateCommonReducers<
    DHCPSnippetState,
    DHCPSnippetMeta.PK,
    CreateParams,
    UpdateParams
  >(DHCPSnippetMeta.MODEL, DHCPSnippetMeta.PK),
});

export const { actions } = dhcpSnippetSlice;

export default dhcpSnippetSlice.reducer;
