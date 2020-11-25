import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Zone, ZoneState } from "./types";

type ZoneReducers = SliceCaseReducers<ZoneState>;

export type ZoneSlice = GenericSlice<ZoneState, Zone, ZoneReducers>;

const zoneSlice = generateSlice<Zone, ZoneState["errors"], ZoneReducers, "id">({
  indexKey: "id",
  name: "zone",
}) as ZoneSlice;

export const { actions } = zoneSlice;

export default zoneSlice.reducer;
