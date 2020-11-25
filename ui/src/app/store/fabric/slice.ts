import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Fabric, FabricState } from "./types";

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
