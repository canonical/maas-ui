import { createSlice } from "@reduxjs/toolkit";

import type { DeviceState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const deviceSlice = createSlice({
  name: "device",
  initialState: genericInitialState as DeviceState,
  reducers: generateCommonReducers<DeviceState, "system_id">(
    "device",
    "system_id"
  ),
});

export const { actions } = deviceSlice;

export default deviceSlice.reducer;
