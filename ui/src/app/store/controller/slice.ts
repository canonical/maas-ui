import { createSlice } from "@reduxjs/toolkit";

import type { Controller, ControllerState } from "./types";
import { ControllerMeta } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";
import type { Zone, ZoneMeta } from "app/store/zone/types";

type CreateParams = {
  description?: Controller["description"];
  domain?: Controller["domain"];
  zone?: Zone[ZoneMeta.PK];
};

type UpdateParams = CreateParams & {
  [ControllerMeta.PK]: Controller[ControllerMeta.PK];
};

const controllerSlice = createSlice({
  name: ControllerMeta.MODEL,
  initialState: genericInitialState as ControllerState,
  reducers: generateCommonReducers<
    ControllerState,
    ControllerMeta.PK,
    CreateParams,
    UpdateParams
  >(ControllerMeta.MODEL, ControllerMeta.PK),
});

export const { actions } = controllerSlice;

export default controllerSlice.reducer;
