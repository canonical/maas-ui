import { createSlice } from "@reduxjs/toolkit";

import { PackageRepositoryMeta } from "./types";
import type { PackageRepositoryState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const packageRepositorySlice = createSlice({
  name: PackageRepositoryMeta.MODEL,
  initialState: genericInitialState as PackageRepositoryState,
  reducers: generateCommonReducers<
    PackageRepositoryState,
    PackageRepositoryMeta.PK
  >(PackageRepositoryMeta.MODEL, PackageRepositoryMeta.PK),
});

export const { actions } = packageRepositorySlice;

export default packageRepositorySlice.reducer;
