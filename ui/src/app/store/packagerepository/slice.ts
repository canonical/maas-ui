import { createSlice } from "@reduxjs/toolkit";

import { PackageRepositoryMeta } from "./types";
import type { PackageRepository, PackageRepositoryState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  name: PackageRepository["name"];
  url: PackageRepository["url"];
  distributions?: PackageRepository["distributions"];
  disabled_pockets?: PackageRepository["disabled_pockets"];
  disabled_components?: PackageRepository["disabled_components"];
  disable_sources?: PackageRepository["disable_sources"];
  components?: PackageRepository["components"];
  arches?: PackageRepository["arches"];
  key?: PackageRepository["key"];
  enabled?: PackageRepository["enabled"];
};

type UpdateParams = CreateParams & {
  [PackageRepositoryMeta.PK]: PackageRepository[PackageRepositoryMeta.PK];
};

const packageRepositorySlice = createSlice({
  name: PackageRepositoryMeta.MODEL,
  initialState: genericInitialState as PackageRepositoryState,
  reducers: generateCommonReducers<
    PackageRepositoryState,
    PackageRepositoryMeta.PK,
    CreateParams,
    UpdateParams
  >(PackageRepositoryMeta.MODEL, PackageRepositoryMeta.PK),
});

export const { actions } = packageRepositorySlice;

export default packageRepositorySlice.reducer;
