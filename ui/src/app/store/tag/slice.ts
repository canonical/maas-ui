import { createSlice } from "@reduxjs/toolkit";

import type { TagState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const tagSlice = createSlice({
  name: "tag",
  initialState: genericInitialState as TagState,
  reducers: generateCommonReducers<TagState, "id">("tag", "id"),
});

export const { actions } = tagSlice;

export default tagSlice.reducer;
