import { createSlice } from "@reduxjs/toolkit";

import { TokenMeta } from "./types";
import type { Token, TokenState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  name?: string;
};

type UpdateParams = CreateParams & {
  [TokenMeta.PK]: Token[TokenMeta.PK];
};

const tokenSlice = createSlice({
  name: TokenMeta.MODEL,
  initialState: genericInitialState as TokenState,
  reducers: generateCommonReducers<
    TokenState,
    TokenMeta.PK,
    CreateParams,
    UpdateParams
  >(TokenMeta.MODEL, TokenMeta.PK),
});

export const { actions } = tokenSlice;

export default tokenSlice.reducer;
