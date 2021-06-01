import { createSlice } from "@reduxjs/toolkit";

import type { DHCPSnippet, DHCPSnippetState } from "./types";
import { DHCPSnippetMeta } from "./types";

import type { Model } from "app/store/types/model";
import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  description?: DHCPSnippet["description"];
  enabled?: DHCPSnippet["enabled"];
  global_snippet?: boolean;
  iprange?: Model["id"];
  name?: DHCPSnippet["name"];
  node?: DHCPSnippet["node"];
  subnet?: DHCPSnippet["subnet"];
  value?: DHCPSnippet["value"];
};

type UpdateParams = CreateParams & {
  [DHCPSnippetMeta.PK]: DHCPSnippet[DHCPSnippetMeta.PK];
};

const dhcpSnippetSlice = createSlice({
  name: DHCPSnippetMeta.MODEL,
  initialState: genericInitialState as DHCPSnippetState,
  reducers: generateCommonReducers<
    DHCPSnippetState,
    DHCPSnippetMeta.PK,
    CreateParams,
    UpdateParams
  >(DHCPSnippetMeta.MODEL, DHCPSnippetMeta.PK),
});

export const { actions } = dhcpSnippetSlice;

export default dhcpSnippetSlice.reducer;
