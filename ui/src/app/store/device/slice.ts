import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Device, DeviceState } from "./types";

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
