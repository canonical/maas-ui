import { createSlice } from "@reduxjs/toolkit";

import type { ServiceState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const serviceSlice = createSlice({
  name: "service",
  initialState: genericInitialState as ServiceState,
  reducers: generateCommonReducers<ServiceState, "id">("service", "id"),
});

export const { actions } = serviceSlice;

export default serviceSlice.reducer;
