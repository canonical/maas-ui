import { createSlice } from "@reduxjs/toolkit";

import { TagMeta } from "./types";
import type { TagState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const tagSlice = createSlice({
  name: TagMeta.MODEL,
  initialState: genericInitialState as TagState,
  reducers: generateCommonReducers<TagState, TagMeta.PK>(
    TagMeta.MODEL,
    TagMeta.PK
  ),
});

export const { actions } = tagSlice;

export default tagSlice.reducer;
