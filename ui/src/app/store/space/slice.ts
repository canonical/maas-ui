import { createSlice } from "@reduxjs/toolkit";

import type { SpaceState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const spaceSlice = createSlice({
  name: "space",
  initialState: genericInitialState as SpaceState,
  reducers: generateCommonReducers<SpaceState, "id">("space", "id"),
});

export const { actions } = spaceSlice;

export default spaceSlice.reducer;
