import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { Space, SpaceState } from "./types";

type SpaceReducers = SliceCaseReducers<SpaceState>;

export type SpaceSlice = GenericSlice<SpaceState, Space, SpaceReducers>;

const SpaceSlice = generateSlice<Space, SpaceState["errors"], SpaceReducers>({
  name: "space",
}) as SpaceSlice;

export const { actions } = SpaceSlice;

export default SpaceSlice.reducer;
