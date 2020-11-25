import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Controller, ControllerState } from "./types";

type ControllerReducers = SliceCaseReducers<ControllerState>;

export type ControllerSlice = GenericSlice<
  ControllerState,
  Controller,
  ControllerReducers
>;

const controllerSlice = generateSlice<
  Controller,
  ControllerState["errors"],
  ControllerReducers,
  "system_id"
>({
  indexKey: "system_id",
  name: "controller",
}) as ControllerSlice;

export const { actions } = controllerSlice;

export default controllerSlice.reducer;
