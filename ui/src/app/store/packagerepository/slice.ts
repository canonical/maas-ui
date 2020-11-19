import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { PackageRepository, PackageRepositoryState } from "./types";

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
