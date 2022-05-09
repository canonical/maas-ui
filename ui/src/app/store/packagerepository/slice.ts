import { createSlice } from "@reduxjs/toolkit";

import { PackageRepositoryMeta } from "./types";
import type {
  CreateParams,
  PackageRepositoryState,
  UpdateParams,
} from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const packageRepositorySlice = createSlice({
  initialState: genericInitialState as PackageRepositoryState,
  name: PackageRepositoryMeta.MODEL,
  reducers: generateCommonReducers<
    PackageRepositoryState,
    PackageRepositoryMeta.PK,
    CreateParams,
    UpdateParams
  >(PackageRepositoryMeta.MODEL, PackageRepositoryMeta.PK),
});

export const { actions } = packageRepositorySlice;

export default packageRepositorySlice.reducer;
