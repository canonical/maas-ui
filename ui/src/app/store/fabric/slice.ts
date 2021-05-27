import { createSlice } from "@reduxjs/toolkit";

import type { FabricState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const fabricSlice = createSlice({
  name: "fabric",
  initialState: genericInitialState as FabricState,
  reducers: generateCommonReducers<FabricState, "id">("fabric", "id"),
});

export const { actions } = fabricSlice;

export default fabricSlice.reducer;
