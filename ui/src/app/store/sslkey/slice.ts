import { createSlice } from "@reduxjs/toolkit";

import { SSLKeyMeta } from "./types";
import type { SSLKeyState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const sslKeySlice = createSlice({
  name: SSLKeyMeta.MODEL,
  initialState: genericInitialState as SSLKeyState,
  reducers: generateCommonReducers<SSLKeyState, SSLKeyMeta.PK>(
    SSLKeyMeta.MODEL,
    SSLKeyMeta.PK
  ),
});

export const { actions } = sslKeySlice;

export default sslKeySlice.reducer;
