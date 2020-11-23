import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";

import { Fabric, FabricState } from "./types";

type FabricReducers = SliceCaseReducers<FabricState>;

export type FabricSlice = GenericSlice<FabricState, Fabric, FabricReducers>;

const fabricSlice = generateSlice<
  Fabric,
  FabricState["errors"],
  FabricReducers,
  "id"
>({
  indexKey: "id",
  name: "fabric",
}) as FabricSlice;

export const { actions } = fabricSlice;

export default fabricSlice.reducer;
