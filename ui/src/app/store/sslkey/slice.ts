import { createSlice } from "@reduxjs/toolkit";

import { SSLKeyMeta } from "./types";
import type { SSLKey, SSLKeyState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  key: SSLKey["key"];
};

const sslKeySlice = createSlice({
  name: SSLKeyMeta.MODEL,
  initialState: genericInitialState as SSLKeyState,
  reducers: generateCommonReducers<
    SSLKeyState,
    SSLKeyMeta.PK,
    CreateParams,
    void
  >(SSLKeyMeta.MODEL, SSLKeyMeta.PK),
});

export const { actions } = sslKeySlice;

export default sslKeySlice.reducer;
