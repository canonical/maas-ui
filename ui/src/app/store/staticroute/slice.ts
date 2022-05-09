import { createSlice } from "@reduxjs/toolkit";

import { StaticRouteMeta } from "./types";
import type { CreateParams, StaticRouteState, UpdateParams } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const staticRouteSlice = createSlice({
  initialState: genericInitialState as StaticRouteState,
  name: StaticRouteMeta.MODEL,
  reducers: generateCommonReducers<
    StaticRouteState,
    StaticRouteMeta.PK,
    CreateParams,
    UpdateParams
  >(StaticRouteMeta.MODEL, StaticRouteMeta.PK),
});

export const { actions } = staticRouteSlice;

export default staticRouteSlice.reducer;
