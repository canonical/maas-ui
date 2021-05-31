import { createSlice } from "@reduxjs/toolkit";

import { TokenMeta } from "./types";
import type { TokenState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const tokenSlice = createSlice({
  name: TokenMeta.MODEL,
  initialState: genericInitialState as TokenState,
  reducers: generateCommonReducers<TokenState, TokenMeta.PK>(
    TokenMeta.MODEL,
    TokenMeta.PK
  ),
});

export const { actions } = tokenSlice;

export default tokenSlice.reducer;
