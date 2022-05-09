import { createSlice } from "@reduxjs/toolkit";

import { SSLKeyMeta } from "./types";
import type { CreateParams, SSLKeyState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const sslKeySlice = createSlice({
  initialState: genericInitialState as SSLKeyState,
  name: SSLKeyMeta.MODEL,
  reducers: generateCommonReducers<
    SSLKeyState,
    SSLKeyMeta.PK,
    CreateParams,
    void
  >(SSLKeyMeta.MODEL, SSLKeyMeta.PK),
});

export const { actions } = sslKeySlice;

export default sslKeySlice.reducer;
