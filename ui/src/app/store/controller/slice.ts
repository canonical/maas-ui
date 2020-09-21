import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { Controller, ControllerState } from "./types";

type ControllerReducers = SliceCaseReducers<ControllerState>;

export type ControllerSlice = GenericSlice<
  ControllerState,
  Controller,
  ControllerReducers
>;

const controllerSlice = generateSlice<
  Controller,
  ControllerState["errors"],
  ControllerReducers
>({
  name: "controller",
}) as ControllerSlice;

export const { actions } = controllerSlice;

export default controllerSlice.reducer;
