import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Space, SpaceState } from "./types";

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
