import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { Device, DeviceState } from "./types";

type DeviceReducers = SliceCaseReducers<DeviceState>;

export type DeviceSlice = GenericSlice<DeviceState, Device, DeviceReducers>;

const seviceSlice = generateSlice<
  Device,
  DeviceState["errors"],
  DeviceReducers,
  "system_id"
>({
  indexKey: "system_id",
  name: "device",
}) as DeviceSlice;

export const { actions } = seviceSlice;

export default seviceSlice.reducer;
