import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { Space, SpaceState } from "./types";

type SpaceReducers = SliceCaseReducers<SpaceState>;

export type SpaceSlice = GenericSlice<SpaceState, Space, SpaceReducers>;

const spaceSlice = generateSlice<
  Space,
  SpaceState["errors"],
  SpaceReducers,
  "id"
>({
  indexKey: "id",
  name: "space",
}) as SpaceSlice;

export const { actions } = spaceSlice;

export default spaceSlice.reducer;
