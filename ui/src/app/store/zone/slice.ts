import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { Zone, ZoneState } from "./types";

type ZoneReducers = SliceCaseReducers<ZoneState>;

export type ZoneSlice = GenericSlice<ZoneState, Zone, ZoneReducers>;

const ZoneSlice = generateSlice<Zone, ZoneState["errors"], ZoneReducers>({
  name: "zone",
}) as ZoneSlice;

export const { actions } = ZoneSlice;

export default ZoneSlice.reducer;
