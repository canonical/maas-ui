import { createSlice } from "@reduxjs/toolkit";

import { ZoneMeta } from "./types";
import type { CreateParams, UpdateParams, ZoneState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const zoneSlice = createSlice({
  initialState: genericInitialState as ZoneState,
  name: ZoneMeta.MODEL,
  reducers: generateCommonReducers<
    ZoneState,
    ZoneMeta.PK,
    CreateParams,
    UpdateParams
  >(ZoneMeta.MODEL, ZoneMeta.PK),
});

export const { actions } = zoneSlice;

export default zoneSlice.reducer;
