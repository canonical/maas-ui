import { createSlice } from "@reduxjs/toolkit";

import type { PackageRepositoryState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const packageRepositorySlice = createSlice({
  name: "packagerepository",
  initialState: genericInitialState as PackageRepositoryState,
  reducers: generateCommonReducers<PackageRepositoryState, "id">(
    "packagerepository",
    "id"
  ),
});

export const { actions } = packageRepositorySlice;

export default packageRepositorySlice.reducer;
