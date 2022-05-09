import { createSlice } from "@reduxjs/toolkit";

import type { ServiceState } from "./types";
import { ServiceMeta } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const serviceSlice = createSlice({
  initialState: genericInitialState as ServiceState,
  name: ServiceMeta.MODEL,
  reducers: generateCommonReducers<ServiceState, ServiceMeta.PK, void, void>(
    ServiceMeta.MODEL,
    ServiceMeta.PK
  ),
});

export const { actions } = serviceSlice;

export default serviceSlice.reducer;
