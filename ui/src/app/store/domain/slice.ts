import { createSlice } from "@reduxjs/toolkit";

import type { DomainState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const domainSlice = createSlice({
  name: "domain",
  initialState: genericInitialState as DomainState,
  reducers: generateCommonReducers<DomainState, "id">("domain", "id"),
});

export const { actions } = domainSlice;

export default domainSlice.reducer;
