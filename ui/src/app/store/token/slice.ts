import { createSlice } from "@reduxjs/toolkit";

import type { TokenState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const tokenSlice = createSlice({
  name: "token",
  initialState: genericInitialState as TokenState,
  reducers: generateCommonReducers<TokenState, "id">("token", "id"),
});

export const { actions } = tokenSlice;

export default tokenSlice.reducer;
