import { createSlice } from "@reduxjs/toolkit";

import { VLANMeta } from "./types";
import type { VLANState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const vlanSlice = createSlice({
  name: VLANMeta.MODEL,
  initialState: genericInitialState as VLANState,
  reducers: generateCommonReducers<VLANState, VLANMeta.PK>(
    VLANMeta.MODEL,
    VLANMeta.PK
  ),
});

export const { actions } = vlanSlice;

export default vlanSlice.reducer;
