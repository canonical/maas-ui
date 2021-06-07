import { createSlice } from "@reduxjs/toolkit";

import { SpaceMeta } from "./types";
import type { CreateParams, SpaceState, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const spaceSlice = createSlice({
  name: SpaceMeta.MODEL,
  initialState: genericInitialState as SpaceState,
  reducers: generateCommonReducers<
    SpaceState,
    SpaceMeta.PK,
    CreateParams,
    UpdateParams
  >(SpaceMeta.MODEL, SpaceMeta.PK),
});

export const { actions } = spaceSlice;

export default spaceSlice.reducer;
