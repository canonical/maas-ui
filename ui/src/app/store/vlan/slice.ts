import { createSlice } from "@reduxjs/toolkit";

import type { VLANState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const vlanSlice = createSlice({
  name: "vlan",
  initialState: genericInitialState as VLANState,
  reducers: generateCommonReducers<VLANState, "id">("vlan", "id"),
});

export const { actions } = vlanSlice;

export default vlanSlice.reducer;
