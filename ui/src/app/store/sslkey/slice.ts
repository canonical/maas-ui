import { createSlice } from "@reduxjs/toolkit";

import type { SSLKeyState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const sslKeySlice = createSlice({
  name: "sslkey",
  initialState: genericInitialState as SSLKeyState,
  reducers: generateCommonReducers<SSLKeyState, "id">("sslkey", "id"),
});

export const { actions } = sslKeySlice;

export default sslKeySlice.reducer;
