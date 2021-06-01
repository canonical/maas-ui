import { createSlice } from "@reduxjs/toolkit";

import { ZoneMeta } from "./types";
import type { Zone, ZoneState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  description: Zone["description"];
  name: Zone["name"];
};

type UpdateParams = CreateParams & {
  [ZoneMeta.PK]: Zone[ZoneMeta.PK];
};

const zoneSlice = createSlice({
  name: ZoneMeta.MODEL,
  initialState: genericInitialState as ZoneState,
  reducers: generateCommonReducers<
    ZoneState,
    ZoneMeta.PK,
    CreateParams,
    UpdateParams
  >(ZoneMeta.MODEL, ZoneMeta.PK),
});

export const { actions } = zoneSlice;

export default zoneSlice.reducer;
