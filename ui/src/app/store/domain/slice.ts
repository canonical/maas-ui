import { createSlice } from "@reduxjs/toolkit";

import { DomainMeta } from "./types";
import type { CreateParams, DomainState, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const domainSlice = createSlice({
  name: DomainMeta.MODEL,
  initialState: genericInitialState as DomainState,
  reducers: generateCommonReducers<
    DomainState,
    DomainMeta.PK,
    CreateParams,
    UpdateParams
  >(DomainMeta.MODEL, DomainMeta.PK),
});

export const { actions } = domainSlice;

export default domainSlice.reducer;
