import { createSlice } from "@reduxjs/toolkit";

import type { SubnetState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const subnetSlice = createSlice({
  name: "subnet",
  initialState: genericInitialState as SubnetState,
  reducers: generateCommonReducers<SubnetState, "id">("subnet", "id"),
});

export const { actions } = subnetSlice;

export default subnetSlice.reducer;
