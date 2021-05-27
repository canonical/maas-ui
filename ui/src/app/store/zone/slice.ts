import { createSlice } from "@reduxjs/toolkit";

import type { ZoneState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const zoneSlice = createSlice({
  name: "zone",
  initialState: genericInitialState as ZoneState,
  reducers: generateCommonReducers<ZoneState, "id">("zone", "id"),
});

export const { actions } = zoneSlice;

export default zoneSlice.reducer;
