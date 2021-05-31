import { createSlice } from "@reduxjs/toolkit";

import { SubnetMeta } from "./types";
import type { SubnetState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const subnetSlice = createSlice({
  name: SubnetMeta.MODEL,
  initialState: genericInitialState as SubnetState,
  reducers: generateCommonReducers<SubnetState, SubnetMeta.PK>(
    SubnetMeta.MODEL,
    SubnetMeta.PK
  ),
});

export const { actions } = subnetSlice;

export default subnetSlice.reducer;
