import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { PackageRepository, PackageRepositoryState } from "./types";

type PackageRepositoryReducers = SliceCaseReducers<PackageRepositoryState>;

export type PackageRepositorySlice = GenericSlice<
  PackageRepositoryState,
  PackageRepository,
  PackageRepositoryReducers
>;

const packageRepositorySlice = generateSlice<
  PackageRepository,
  PackageRepositoryState["errors"],
  PackageRepositoryReducers,
  "id"
>({
  indexKey: "id",
  name: "packagerepository",
}) as PackageRepositorySlice;

export const { actions } = packageRepositorySlice;

export default packageRepositorySlice.reducer;
