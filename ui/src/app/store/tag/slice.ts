import { createSlice } from "@reduxjs/toolkit";

import { TagMeta } from "./types";
import type { TagState, CreateParams, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const tagSlice = createSlice({
  initialState: genericInitialState as TagState,
  name: TagMeta.MODEL,
  reducers: generateCommonReducers<
    TagState,
    TagMeta.PK,
    CreateParams,
    UpdateParams
  >(TagMeta.MODEL, TagMeta.PK),
});

export const { actions } = tagSlice;

export default tagSlice.reducer;
