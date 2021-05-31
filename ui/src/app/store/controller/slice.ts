import { createSlice } from "@reduxjs/toolkit";

import type { ControllerState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const controllerSlice = createSlice({
  name: "controller",
  initialState: genericInitialState as ControllerState,
  reducers: generateCommonReducers<ControllerState, "system_id">(
    "controller",
    "system_id"
  ),
});

export const { actions } = controllerSlice;

export default controllerSlice.reducer;
